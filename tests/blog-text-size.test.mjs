import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { JSDOM } from 'jsdom';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const exports = {};
  const js = ts.transpileModule(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  new Function('require', 'exports', js)((name) => name in mocks ? mocks[name] : require(name), exports);
  return exports;
}
const { sanitizeRichText } = load('src/lib/rich-text.ts');

test('all seven text sizes survive save and public rendering with surrounding formatting', () => {
  for (const [index, pixels] of [12, 14, 16, 18, 24, 32, 48].entries()) {
    const saved = sanitizeRichText(`<p>Before <font face="Georgia" size="${index + 1}"><b>Sized words</b></font> after</p>`);
    assert.equal(saved, `<p>Before <span style="font-family: Georgia; font-size: ${pixels}px"><b>Sized words</b></span> after</p>`);
    assert.equal(sanitizeRichText(saved), saved);
  }
  assert.equal(sanitizeRichText('<span style="font-size: 999px; position: fixed">Bad size</span><font size="+7">Other</font>'), '<span>Bad size</span><span>Other</span>');
});

test('size selector restores the selected story text after toolbar focus and emits formatted content', () => {
  const dom = new JSDOM('<div id="editor" tabindex="0"><p>Before selected after</p></div><select id="toolbar"></select>');
  const priorWindow = globalThis.window, priorDocument = globalThis.document;
  globalThis.window = dom.window; globalThis.document = dom.window.document;
  try {
    const editor = document.querySelector('#editor');
    const refs = [{ current: editor }, { current: null }]; let refIndex = 0;
    const react = { ...require('react'), useRef: () => refs[refIndex++], useState: () => [null, () => {}], useEffect() {}, useImperativeHandle() {} };
    const Component = load('src/components/admin/RichTextEditor.tsx', { react, '@/lib/rich-text': { sanitizeRichText }, '@/lib/blog-editor-images': {} }).default;
    const emitted = [];
    const tree = Component.render({ value: editor.innerHTML, onChange: (html) => emitted.push(html) }, null);
    const nodes = []; const walk = (node) => { if (!node?.props) return; nodes.push(node); for (const child of [node.props.children].flat(Infinity)) walk(child); }; walk(tree);
    const range = document.createRange(); range.setStart(editor.querySelector('p').firstChild, 7); range.setEnd(editor.querySelector('p').firstChild, 15);
    window.getSelection().addRange(range);
    const control = nodes.find((node) => node.props['aria-label'] === 'Text size');
    assert.ok(control); control.props.onMouseDown();
    document.querySelector('#toolbar').focus(); window.getSelection().removeAllRanges();
    const calls = [];
    document.execCommand = (command, ui, value) => {
      calls.push([command, value]);
      if (command === 'fontSize') {
        assert.equal(window.getSelection().toString(), 'selected');
        const selectedRange = window.getSelection().getRangeAt(0); const font = document.createElement('font'); font.setAttribute('size', value); selectedRange.surroundContents(font);
      }
      return true;
    };
    const target = { value: '5' }; control.props.onChange({ target });
    assert.deepEqual(calls, [['styleWithCSS', 'false'], ['fontSize', '5']]);
    assert.equal(target.value, '');
    assert.equal(editor.querySelector('font').style.fontSize, '24px');
    assert.equal(sanitizeRichText(emitted[0]), '<p>Before <span style="font-size: 24px">selected</span> after</p>');
  } finally { globalThis.window = priorWindow; globalThis.document = priorDocument; dom.window.close(); }
});
