import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);

// Drive the component's event handlers with isolated hook state; no real upload or database.
function uploader(props) {
  const state = []; let cursor = 0;
  const react = { ...require('react'), useState: (initial) => { const index = cursor++; if (!(index in state)) state[index] = initial; return [state[index], (next) => { state[index] = typeof next === 'function' ? next(state[index]) : next; }]; }, useRef: () => ({ current: null }) };
  const js = ts.transpileModule(readFileSync(new URL('../src/components/admin/CaseImageUpload.tsx', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {};
  new Function('require', 'exports', js)((name) => name === 'react' ? react : require(name), exports);
  return () => {
    cursor = 0;
    const tree = exports.default(props);
    const nodes = [];
    const visit = (node) => { if (!node?.props) return; nodes.push(node); for (const child of [node.props.children].flat(Infinity)) visit(child); };
    visit(tree);
    return { file: nodes.find((node) => node.props.type === 'file'), description: nodes.find((node) => node.type === 'input' && node.props.maxLength === 300), button: nodes.find((node) => node.type === 'button'), status: nodes.find((node) => node.props.role === 'status') };
  };
}

test('image picker is clickable without alt text, with explicit validation before upload', async () => {
  const originalFetch = globalThis.fetch;
  const busy = []; let attached; let calls = 0;
  globalThis.fetch = async (url, request) => {
    calls++; assert.equal(url, '/api/admin/media');
    assert.equal(request.body.get('altText'), 'A useful portrait description');
    assert.equal(request.body.get('files').name, 'portrait.png');
    return { ok: true, json: async () => ({ assets: [{ id: 'portrait' }] }) };
  };
  const render = uploader({ context: 'page', onUpload: (...values) => { attached = values; }, onBusyChange: (value) => busy.push(value) });
  try {
    assert.equal(render().file.props.disabled, false);
    render().file.props.onChange({ target: { files: [new File(['image'], 'portrait.png', { type: 'image/png' })] } });
    assert.equal(render().button.props.disabled, false);
    await render().button.props.onClick();
    assert.match(render().status.props.children, /description before uploading/);
    assert.equal(calls, 0);
    render().description.props.onChange({ target: { value: 'A useful portrait description' } });
    await render().button.props.onClick();
    assert.deepEqual(attached, ['/api/media/portrait', 'A useful portrait description']);
    assert.deepEqual(busy, [true, false]);
    assert.match(render().status.props.children, /Save & Publish/);
    assert.equal(render().button.props.disabled, true);
  } finally { globalThis.fetch = originalFetch; }
});

test('portrait upload reports unsupported files and provider errors without attaching an image', async () => {
  const originalFetch = globalThis.fetch;
  let attached = false;
  const render = uploader({ initialAlt: 'Portrait description', onUpload: () => { attached = true; } });
  try {
    render().file.props.onChange({ target: { files: [new File(['pdf'], 'private.pdf', { type: 'application/pdf' })], value: 'private.pdf' } });
    assert.match(render().status.props.children, /Use PNG/);
    assert.equal(render().button.props.disabled, true);
    render().file.props.onChange({ target: { files: [new File(['image'], 'photo.png', { type: 'image/png' })] } });
    globalThis.fetch = async () => ({ ok: false, json: async () => ({ message: 'Vercel Blob is not configured.' }) });
    await render().button.props.onClick();
    assert.equal(render().status.props.children, 'Vercel Blob is not configured.');
    assert.equal(attached, false);
    assert.equal(render().button.props.disabled, false);
  } finally { globalThis.fetch = originalFetch; }
});
