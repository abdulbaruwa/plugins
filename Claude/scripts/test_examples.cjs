const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const skillDir = path.join(__dirname, '../plugins/cursor-team-kit/skills/pr-review-canvas');
const instructions = fs.readFileSync(path.join(skillDir, 'SKILL.md'), 'utf8');
const filename = instructions.match(/<span class="fname">([^<]+)<\/span>/)[1];
const exampleKey = instructions.match(/data-diff="([^"]+)"/)[1];
const target = {innerHTML: '', getAttribute: () => exampleKey};
let ready;
const context = {console, document: {
  addEventListener: (_, callback) => { ready = callback; },
  getElementById: () => ({textContent: JSON.stringify({[filename]: '@@ -0,0 +1 @@\n+const count = 1;'})}),
  querySelectorAll: () => [target],
}};
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(skillDir, 'renderer.js'), 'utf8'), context);
ready();
assert(target.innerHTML.includes('const count = 1;'), 'documented HTML example must render the patch for its named file');
console.log('Documented PR example renders its exact filename.');
