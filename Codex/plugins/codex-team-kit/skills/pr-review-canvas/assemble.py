#!/usr/bin/env python3
"""Create and serve one isolated PR walkthrough. No API or account writes."""

import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import re
import tempfile
import uuid


def inside(root, path):
    try:
        return path.resolve().is_relative_to(root.resolve())
    except (OSError, RuntimeError, ValueError):
        return False


class RunHandler(SimpleHTTPRequestHandler):
    def send_head(self):
        public = Path(self.directory)
        requested = Path(self.translate_path(self.path))
        if requested == public:
            requested = public / "index.html"
        if requested != public / "index.html" or not inside(public, requested):
            self.send_error(404, "Resource is outside this review")
            return None
        # Resolve the directory route here; superclass index discovery must not
        # select an unchecked symlink or expose a directory listing.
        self.path = "/index.html"
        return super().send_head()


def new_run(repo, pr, parent=None):
    if not re.fullmatch(r"[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+", repo) or any(p in (".", "..") for p in repo.split("/")):
        raise ValueError("repository must be owner/repository")
    if pr < 1:
        raise ValueError("PR number must be positive")
    run_id = uuid.uuid4().hex
    directory = Path(tempfile.mkdtemp(prefix=f"pr-review-{repo.replace('/', '-')}-{pr}-", dir=parent)).resolve()
    (directory / "review.json").write_text(json.dumps({"repo": repo, "pr": pr, "run_id": run_id}), encoding="utf-8")
    return {"run_dir": str(directory), "repo": repo, "pr": pr, "run_id": run_id}


def verify_run(directory, repo, pr, run_id):
    directory = directory.resolve()
    metadata = directory / "review.json"
    if not inside(directory, metadata):
        raise ValueError("review metadata escapes the run directory")
    value = json.loads(metadata.read_text(encoding="utf-8"))
    if value != {"repo": repo, "pr": pr, "run_id": run_id}:
        raise ValueError("review identity does not match this run")
    return directory


def assemble(directory, repo, pr, run_id):
    directory = verify_run(directory, repo, pr, run_id)
    inputs = [directory / name for name in ("body.html", "patches.json")]
    if not all(inside(directory, p) for p in inputs):
        raise ValueError("input escapes the run directory")
    body = inputs[0].read_text(encoding="utf-8")
    patches = json.loads(inputs[1].read_text(encoding="utf-8"))
    if not isinstance(patches, dict) or not all(isinstance(k, str) and isinstance(v, str) for k, v in patches.items()):
        raise ValueError("patches must map exact filenames to patch strings")
    resources = Path(__file__).resolve().parent
    output = (resources / "template.html").read_text(encoding="utf-8")
    safe_json = json.dumps(patches).replace("<", "\\u003c").replace(">", "\\u003e").replace("&", "\\u0026")
    for marker, value in [
        ("/* INJECT_CSS */", (resources / "styles.css").read_text(encoding="utf-8")),
        ("/* INJECT_JS */", (resources / "renderer.js").read_text(encoding="utf-8")),
        ("<!-- INJECT_BODY -->", body),
        ('{"__PR_DIFFS_PLACEHOLDER__":true}', safe_json),
    ]:
        output = output.replace(marker, value)
    public = directory / "public"
    if not inside(directory, public):
        raise ValueError("public directory escapes this run")
    public.mkdir(exist_ok=True)
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=public, delete=False) as temp:
        temp.write(output)
        temporary = Path(temp.name)
    destination = public / "index.html"
    os.replace(temporary, destination)
    return destination


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="action", required=True)
    new = sub.add_parser("new")
    new.add_argument("--repo", required=True)
    new.add_argument("--pr", type=int, required=True)
    new.add_argument("--parent", type=Path)
    for action in ("assemble", "serve"):
        command = sub.add_parser(action)
        command.add_argument("--run-dir", type=Path, required=True)
        command.add_argument("--repo", required=True)
        command.add_argument("--pr", type=int, required=True)
        command.add_argument("--run-id", required=True)
        if action == "serve":
            command.add_argument("--port", type=int, default=0)
    args = parser.parse_args()
    try:
        if args.action == "new":
            print(json.dumps(new_run(args.repo, args.pr, args.parent)))
        elif args.action == "assemble":
            print(json.dumps({"path": str(assemble(args.run_dir, args.repo, args.pr, args.run_id))}))
        else:
            directory = verify_run(args.run_dir, args.repo, args.pr, args.run_id)
            public = directory / "public"
            if not inside(directory, public) or not inside(public, public / "index.html") or not (public / "index.html").is_file():
                raise ValueError("assemble this run before serving it")
            handler = partial(RunHandler, directory=str(public))
            with ThreadingHTTPServer(("127.0.0.1", args.port), handler) as server:
                print(json.dumps({"url": f"http://127.0.0.1:{server.server_port}/index.html"}), flush=True)
                server.serve_forever()
    except (OSError, ValueError) as exc:
        parser.exit(1, f"review error: {exc}\n")
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
