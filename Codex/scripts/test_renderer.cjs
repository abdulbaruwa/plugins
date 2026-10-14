const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const supplied = process.argv.slice(2);
const filenames = supplied.length ? supplied : ['pr-review-canvas', 'codex-team-kit'].map(plugin =>
  path.join(__dirname, '..', 'plugins', plugin, 'skills', 'pr-review-canvas', 'renderer.js'));
for (const filename of filenames) {
  const plugin = filename;
  const context = { document: { addEventListener() {} }, console };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(filename, 'utf8'), context, { filename });
  function render(patch) {
    const target = { innerHTML: '' };
    context.renderDiff(target, patch);
    return target.innerHTML;
  }
  function cells(html) {
    return [...html.matchAll(/<td class="diff-ln">([^<]*)<\/td>/g)].map(m => m[1]).filter(Boolean);
  }
  const imports = render('@@ -10,3 +10,3 @@\n-import { safeRead } from "safe";\n+import { unsafeRead } from "unsafe";\n const mode = true;\n mode();\n');
  assert(imports.includes('safeRead') && imports.includes('unsafeRead'), plugin);
  assert.deepEqual(cells(imports), ['10', '10', '11', '11', '12', '12']);
  const contextImport = render('@@ -1,3 +1,3 @@\n import lib from "lib";\n-old();\n+newCall();\n done();');
  assert.deepEqual(cells(contextImport), ['1', '1', '2', '2', '3', '3']);
  const whitespace = render('@@ -5,2 +8,2 @@\n-let x = 1;\n+let x=1;\n done();');
  assert.deepEqual(cells(whitespace), ['5', '8', '6', '9']);
  assert(whitespace.includes('diff-add') && whitespace.includes('diff-del'));
  const stringWhitespace = render('@@ -1 +1 @@\n-const x = "a b";\n+const x = "ab";');
  assert(stringWhitespace.includes('"a b"') && stringWhitespace.includes('"ab"'));
  const indentation = render('@@ -1 +1 @@\n-    return value\n+return value');
  assert(indentation.includes('diff-add') && indentation.includes('diff-del'));
  const noNewline = render('--- a/file\n+++ b/file\n@@ -4 +4 @@\n-old\n\\ No newline at end of file\n+new\n\\ No newline at end of file\n');
  assert.deepEqual(cells(noNewline), ['4', '4']);
  const headerLikeCode = render('@@ -3 +3 @@\n--- marker\n+++ marker');
  assert(headerLikeCode.includes('-- marker') && headerLikeCode.includes('++ marker'));
  assert.deepEqual(cells(headerLikeCode), ['3', '3']);
  const separateHunks = render('@@ -1 +1 @@\n-a\n+b\n@@ -20 +30 @@\n-c\n+d');
  assert.deepEqual(cells(separateHunks), ['1', '1', '20', '30']);
  const unsafe = render('@@ -0,0 +1 @@\n+<img src=x onerror="bad()">');
  assert(!unsafe.includes('<img') && unsafe.includes('&lt;img'));
}
console.log(`${filenames.length} PR renderers: line mapping, visible imports, hunk parsing, and escaping passed.`);
