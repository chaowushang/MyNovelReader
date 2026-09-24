const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

for (const [file, name] of [['src/MyNovelReader/app.js', 'App'], ['scripts/MyNovelReader.user.js', 'App$1']]) {
  function setup() {
    let handler, requests = 0, focus = 0, keys = 0, errors = 0, removed = false;
    let request = () => Promise.resolve();
    const chain = new Proxy({}, { get: (_, key) => (...args) => {
      if (key === 'on' && args[0] === 'scroll') handler = args[1];
      if (key === 'off') { assert.equal(args[1], handler); removed = true; }
      return chain;
    }});
    const app = { remove: [], getRemain: () => 0,
      scrollForce: () => { requests++; return request(); },
      updateCurFocusElement: () => focus++, registerKeys: () => keys++,
      $content: chain, $menuHeader: chain, $menuBar: chain, $doc: chain };
    const source = fs.readFileSync(file, 'utf8');
    const start = source.indexOf('registerControls: function() {');
    const end = source.indexOf('registerKeys: function()', start);
    const context = vm.createContext({ [name]: app, Setting: { remain_height: 400 },
      _: { throttle: f => f }, $: () => chain, window: {},
      C: { error: () => errors++ }, UI: { preferencesShow() {} }, GM_registerMenuCommand() {} });
    vm.runInContext('String.prototype.uiTrans = function() { return this.toString() }', context);
    vm.runInContext('({' + source.slice(start, end) + '}).registerControls()', context);
    return { app, fire: () => handler(), setRequest: f => request = f,
      stats: () => ({ requests, focus, keys, errors, removed }) };
  }
  test(file + ': registration, concurrent scrolling, focus and cleanup', async () => {
    const x = setup();
    let resolve;
    x.setRequest(() => new Promise(r => resolve = r));
    x.fire(); x.fire();
    assert.deepEqual(x.stats(), { requests: 1, focus: 2, keys: 1, errors: 0, removed: false });
    resolve(); await new Promise(setImmediate);
    x.fire(); assert.equal(x.stats().requests, 2);
    x.app.remove.forEach(f => f());
    x.fire(); assert.equal(x.stats().requests, 2);
    assert.equal(x.stats().focus, 3);
    assert.equal(x.stats().removed, true);
    resolve(); await new Promise(setImmediate);
  });
  test(file + ': pause, end and distance prevent loading; errors release lock', async () => {
    const x = setup();
    x.app.paused = true; x.fire();
    x.app.paused = false; x.app.isTheEnd = true; x.fire();
    x.app.isTheEnd = false; x.app.getRemain = () => 601; x.fire();
    assert.equal(x.stats().requests, 0);
    x.app.getRemain = () => 599;
    x.setRequest(() => Promise.reject(new Error('network')));
    x.fire(); await new Promise(setImmediate);
    x.fire(); await new Promise(setImmediate);
    assert.equal(x.stats().requests, 2);
    assert.equal(x.stats().errors, 2);
  });
}

test('distributed userscript parses', () => {
  new vm.Script(fs.readFileSync('scripts/MyNovelReader.user.js', 'utf8'));
});
