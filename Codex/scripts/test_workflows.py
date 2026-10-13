import importlib.util
import json
from pathlib import Path
import re
import selectors
import subprocess
import sys
import tempfile
import unittest
from urllib.error import HTTPError
from urllib.request import urlopen


ROOT = Path(__file__).resolve().parents[1]


def module_at(path):
    spec = importlib.util.spec_from_file_location(path.parent.name + path.stem, path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


class PrRunTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def helpers(self):
        return [module_at(ROOT / 'plugins' / name / 'skills/pr-review-canvas/assemble.py')
                for name in ('pr-review-canvas', 'codex-team-kit')]

    def inputs(self, run, label):
        directory = Path(run['run_dir'])
        (directory / 'body.html').write_text(f'<p>{label}</p><div data-diff="file.ts"></div>')
        (directory / 'patches.json').write_text(json.dumps({'file.ts': f'@@ -0,0 +1 @@\n+{label}'}))
        return directory

    def test_same_pr_numbers_and_same_pr_runs_stay_isolated(self):
        for helper in self.helpers():
            with self.subTest(helper=helper.__file__):
                runs = [helper.new_run(repo, 42, self.root) for repo in ('owner/a', 'owner/b', 'owner/a')]
                self.assertEqual(len({r['run_dir'] for r in runs}), 3)
                self.assertEqual(len({r['run_id'] for r in runs}), 3)
                outputs = []
                for index, run in enumerate(runs):
                    directory = self.inputs(run, f'only-{index}')
                    outputs.append(helper.assemble(directory, run['repo'], run['pr'], run['run_id']))
                for index, output in enumerate(outputs):
                    text = output.read_text()
                    self.assertIn(f'only-{index}', text)
                    for other in range(3):
                        if other != index:
                            self.assertNotIn(f'only-{other}', text)

    def test_wrong_run_identity_is_rejected(self):
        for helper in self.helpers():
            run = helper.new_run('owner/a', 42, self.root)
            directory = self.inputs(run, 'correct')
            for repo, run_id in (('owner/b', run['run_id']), ('owner/a', 'other-run')):
                with self.subTest(repo=repo, run_id=run_id):
                    with self.assertRaisesRegex(ValueError, 'identity'):
                        helper.assemble(directory, repo, 42, run_id)

    def test_patch_data_is_script_safe_and_resources_do_not_depend_on_cwd(self):
        for helper in self.helpers():
            run = helper.new_run('owner/a', 42, self.root)
            directory = self.inputs(run, 'body')
            patch = '+</script><script>bad()</script>'
            (directory / 'patches.json').write_text(json.dumps({'quote".ts': patch}))
            output = helper.assemble(directory, run['repo'], run['pr'], run['run_id'])
            text = output.read_text()
            match = re.search(r'<script\b(?=[^>]*\bid="pr-diffs-json")(?=[^>]*\btype="application/json")[^>]*>(.*?)</script>', text, re.S)
            self.assertIsNotNone(match)
            payload = match.group(1)
            self.assertNotIn('<script>', payload)
            self.assertEqual(json.loads(payload), {'quote".ts': patch})
            self.assertNotIn('INJECT_CSS', text)

    def test_external_symlink_inputs_are_rejected(self):
        for helper in self.helpers():
            run = helper.new_run('owner/a', 42, self.root)
            directory = self.inputs(run, 'body')
            outside = self.root / 'outside.html'
            outside.write_text('other task')
            (directory / 'body.html').unlink()
            (directory / 'body.html').symlink_to(outside)
            with self.assertRaisesRegex(ValueError, 'input escapes'):
                helper.assemble(directory, run['repo'], run['pr'], run['run_id'])

    def test_server_exposes_only_this_runs_public_artifact(self):
        for helper in self.helpers():
            run = helper.new_run('owner/a', 42, self.root)
            directory = self.inputs(run, 'private-run')
            helper.assemble(directory, run['repo'], run['pr'], run['run_id'])
            (self.root / 'other-task.txt').write_text('other task')
            (directory / 'public/outside.txt').symlink_to(self.root / 'other-task.txt')
            process = subprocess.Popen([
                sys.executable, helper.__file__, 'serve', '--run-dir', str(directory),
                '--repo', run['repo'], '--pr', str(run['pr']), '--run-id', run['run_id'],
            ], stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
            try:
                with selectors.DefaultSelector() as selector:
                    selector.register(process.stdout, selectors.EVENT_READ)
                    self.assertTrue(selector.select(timeout=5), 'server did not flush its URL')
                    url = json.loads(process.stdout.readline())['url']
                with urlopen(url, timeout=3) as response:
                    self.assertIn(b'private-run', response.read())
                base = url.rsplit('/', 1)[0]
                with urlopen(base + '/', timeout=3) as response:
                    self.assertIn(b'private-run', response.read())
                for target in ('/body.html', '/patches.json', '/review.json', '/other-task.txt', '/../other-task.txt', '/outside.txt'):
                    with self.assertRaises(HTTPError) as raised:
                        urlopen(base + target, timeout=3)
                    self.assertEqual(raised.exception.code, 404)
                    raised.exception.close()
                index = directory / 'public/index.html'
                index.unlink()
                index.symlink_to(self.root / 'other-task.txt')
                for target in ('/', '/index.html'):
                    with self.assertRaises(HTTPError) as raised:
                        urlopen(base + target, timeout=3)
                    self.assertEqual(raised.exception.code, 404)
                    raised.exception.close()
            finally:
                process.terminate()
                process.wait(timeout=5)
                process.stdout.close()

    def test_server_rejects_an_external_index_before_startup(self):
        for helper in self.helpers():
            run = helper.new_run('owner/a', 42, self.root)
            directory = self.inputs(run, 'body')
            index = helper.assemble(directory, run['repo'], run['pr'], run['run_id'])
            outside = self.root / 'other-task.txt'
            outside.write_text('other task')
            index.unlink()
            index.symlink_to(outside)
            result = subprocess.run([
                sys.executable, helper.__file__, 'serve', '--run-dir', str(directory),
                '--repo', run['repo'], '--pr', str(run['pr']), '--run-id', run['run_id'],
            ], capture_output=True, text=True, timeout=5)
            self.assertEqual(result.returncode, 1)
            self.assertNotIn('http://', result.stdout)


class RalphOwnershipTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.helper = module_at(ROOT / 'plugins/ralph-loop/skills/ralph-loop/state.py')

    def state_path(self, run):
        return self.root / '.codex/ralph/runs' / run['run_id'] / 'state.json'

    def test_same_task_in_two_chats_has_separate_state_and_cancel(self):
        a = self.helper.start(self.root, 'chat-a', 'same task', 10)
        b = self.helper.start(self.root, 'chat-b', 'same task', 10)
        self.assertNotEqual(a['run_id'], b['run_id'])
        before_b = self.state_path(b).read_bytes()
        changed = self.helper.change(self.root, 'chat-a', a['run_id'], 'update', 1, evidence=['repro'])
        self.helper.change(self.root, 'chat-a', a['run_id'], 'cancel')
        self.assertEqual(self.state_path(b).read_bytes(), before_b)
        cancelled = self.helper.show(self.root, 'chat-a', a['run_id'])
        self.assertEqual(cancelled['iteration'], 1)
        self.assertEqual(cancelled['last_evidence'], changed['last_evidence'])
        self.assertEqual(cancelled['status'], 'cancelled')

    def test_wrong_chat_cannot_read_or_cancel_a_run(self):
        run = self.helper.start(self.root, 'chat-b', 'task', 10)
        before = self.state_path(run).read_bytes()
        for action in ('show', 'cancel'):
            with self.subTest(action=action):
                with self.assertRaisesRegex(ValueError, 'not owned'):
                    if action == 'show':
                        self.helper.show(self.root, 'chat-a', run['run_id'])
                    else:
                        self.helper.change(self.root, 'chat-a', run['run_id'], action)
        self.assertEqual(self.state_path(run).read_bytes(), before)

    def test_two_runs_in_same_chat_are_distinct(self):
        first = self.helper.start(self.root, 'chat-a', 'task', 10)
        second = self.helper.start(self.root, 'chat-a', 'task', 10)
        before = self.state_path(second).read_bytes()
        self.helper.change(self.root, 'chat-a', first['run_id'], 'cancel')
        self.assertEqual(self.state_path(second).read_bytes(), before)

    def test_limit_completion_resume_and_monotonic_progress(self):
        run = self.helper.start(self.root, 'chat-a', 'task', 2)
        with self.assertRaisesRegex(ValueError, 'iteration'):
            self.helper.change(self.root, 'chat-a', run['run_id'], 'update', 2)
        self.helper.change(self.root, 'chat-a', run['run_id'], 'update', 1, status='blocked', evidence=['failed'])
        self.helper.change(self.root, 'chat-a', run['run_id'], 'resume')
        limited = self.helper.change(self.root, 'chat-a', run['run_id'], 'update', 2)
        self.assertEqual(limited['status'], 'limit_reached')
        with self.assertRaisesRegex(ValueError, 'iterations remaining'):
            self.helper.change(self.root, 'chat-a', run['run_id'], 'resume')
        complete = self.helper.start(self.root, 'chat-a', 'task', 10)
        with self.assertRaisesRegex(ValueError, 'fresh evidence'):
            self.helper.change(self.root, 'chat-a', complete['run_id'], 'update', 1, status='completed')
        done = self.helper.change(self.root, 'chat-a', complete['run_id'], 'update', 1, status='completed', evidence=['passed'])
        self.assertEqual(self.helper.change(self.root, 'chat-a', complete['run_id'], 'cancel'), done)

    def test_legacy_state_is_not_adopted(self):
        legacy = self.root / '.codex/ralph/state.json'
        legacy.parent.mkdir(parents=True)
        legacy.write_text('{"status":"active","task":"another chat"}')
        before = legacy.read_bytes()
        run = self.helper.start(self.root, 'chat-a', 'new task', 10)
        self.helper.change(self.root, 'chat-a', run['run_id'], 'cancel')
        self.assertEqual(legacy.read_bytes(), before)

    def test_other_writer_lock_and_path_traversal_are_rejected(self):
        run = self.helper.start(self.root, 'chat-a', 'task', 10)
        directory = self.state_path(run).parent
        (directory / '.update-lock').mkdir()
        before = self.state_path(run).read_bytes()
        with self.assertRaisesRegex(ValueError, 'writer'):
            self.helper.change(self.root, 'chat-a', run['run_id'], 'cancel')
        self.assertEqual(self.state_path(run).read_bytes(), before)
        with self.assertRaisesRegex(ValueError, 'run ID'):
            self.helper.show(self.root, 'chat-a', '../../other')
