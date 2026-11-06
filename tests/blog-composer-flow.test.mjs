import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const exports = {};
  const js = ts.transpileModule(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  new Function('require', 'exports', js)((name) => name in mocks ? mocks[name] : require(name), exports);
  return exports;
}

test('a cover upload stays separate, while adding a story image inserts it without changing the cover', () => {
  const options = load('src/lib/blog-options.ts');
  const inserted = []; let open = false, refIndex = 0;
  const refs = [{ current: { insertImage: (image) => inserted.push(image), focus() {} } }, { current: { close() {}, showModal() {} } }];
  const react = { ...require('react'), useRef: () => refs[refIndex++], useState: () => [open, (value) => { open = value; }], useEffect() {} };
  const Composer = load('src/components/admin/BlogComposer.tsx', { react, 'next/image': 'img', './RichTextEditor': 'story-editor', './BlogImageUpload': 'image-uploader', './BlogMediaPanel': 'image-library', '@/lib/blog-options': options }).default;
  const props = { title: 'Business workflow guide', slug: 'workflow-guide', excerpt: 'A useful guide', content: '<p>My story</p>', options: options.emptyBlogOptions, cover: '', disabled: false, onContentChange() {}, onOptionsChange: (patch) => { props.options = { ...props.options, ...patch }; }, onCoverChange: (url) => { props.cover = url; }, onUploadBusy() {} };
  function render() { refIndex = 0; const nodes = []; const visit = (node) => { if (!node?.props) return; nodes.push(node); for (const child of [node.props.children].flat(Infinity)) visit(child); }; visit(Composer(props)); return nodes; }
  const cover = { url: '/api/media/cover', alt: 'Main cover', caption: '' };
  render().find((node) => node.type === 'image-uploader').props.onUploaded(cover);
  assert.equal(props.cover, cover.url); assert.deepEqual(inserted, []);
  let nodes = render();
  assert.ok(nodes.findIndex((node) => node.type === 'story-editor') < nodes.findIndex((node) => node.type === 'image-library'));
  nodes.find((node) => node.type === 'story-editor').props.onAddImage();
  nodes = render();
  const inline = { url: '/api/media/inline', alt: 'Workflow diagram', caption: 'How the workflow connects.' };
  nodes.find((node) => node.type === 'image-uploader' && node.props.label.includes('cursor')).props.onUploaded(inline);
  assert.equal(open, false); assert.deepEqual(inserted, [inline]); assert.equal(props.cover, cover.url);
  assert.deepEqual(props.options.images, [cover, inline]);
});
