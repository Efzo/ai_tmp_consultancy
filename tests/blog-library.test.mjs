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
const options = load('src/lib/blog-options.ts');
const textOf = (node) => node == null || typeof node === 'boolean' ? '' : typeof node !== 'object' ? String(node) : [node.props?.children].flat(Infinity).map(textOf).join('');
function post(id, status = 'DRAFT', category = 'Automation') { return { id, title: `Post ${id}`, slug: `post-${id}`, content: '<p>Story</p>', excerpt: 'A helpful summary', category, status, featuredImage: '', versions: [], updatedAt: '2026-11-06T12:00:00Z', options: structuredClone(options.emptyBlogOptions) }; }
function harness(posts, actions = {}) {
  const state = []; let cursor = 0;
  const react = { ...require('react'), useState(initial) { const index = cursor++; if (!(index in state)) state[index] = typeof initial === 'function' ? initial() : initial; return [state[index], (next) => { state[index] = typeof next === 'function' ? next(state[index]) : next; }]; }, useMemo: (fn) => fn(), useEffect() {}, useRef: () => ({ current: null }) };
  const Editor = load('src/components/admin/BlogEditor.tsx', { react, 'next/image': 'img', 'next/link': 'a', '@/components/admin/BlogComposer': 'composer', '@/lib/blog-options': options, '@/app/actions/cms': actions });
  let nodes;
  const render = () => { cursor = 0; nodes = []; const walk = (node) => { if (!node?.props) return; nodes.push(node); for (const child of [node.props.children].flat(Infinity)) walk(child); }; walk(Editor.default({ posts })); return nodes; };
  const button = (label) => nodes.find((node) => node.type === 'button' && (node.props['aria-label'] === label || textOf(node) === label));
  render();
  return { render, button, nodes: () => nodes, change: (placeholder, value) => nodes.find((node) => node.props.placeholder === placeholder).props.onChange({ target: { value } }), rows: () => nodes.filter((node) => node.type === 'tbody').flatMap((node) => [node.props.children].flat(Infinity)), text: () => nodes.map(textOf).join('\n') };
}

test('library opens without a composer, with status/category/search filters and compact pagination', () => {
  const h = harness([post('live', 'PUBLISHED', 'Websites'), ...Array.from({ length: 21 }, (_, i) => post(String(i))), post('old', 'ARCHIVED')]);
  assert.ok(h.button('New Post'));
  assert.equal(h.nodes().some((node) => node.type === 'composer' || node.props.placeholder === 'Article title'), false);
  assert.equal(h.rows().length, 20);
  h.button('Next').props.onClick(); h.render(); assert.equal(h.rows().length, 3);
  h.button('Published1').props.onClick(); h.render(); assert.equal(h.rows().length, 1); assert.ok(h.button('Edit Post live'));
  h.button('All posts23').props.onClick(); h.render();
  h.nodes().find((node) => node.type === 'select' && textOf(node).includes('All categories')).props.onChange({ target: { value: 'Websites' } }); h.render(); assert.equal(h.rows().length, 1);
  h.change('Search title, category, or summary…', 'missing'); h.render(); assert.ok(h.text().includes('No posts match these filters'));
  h.button('Clear filters').props.onClick(); h.render(); assert.equal(h.rows().length, 20);
});

test('New Post opens one editor; Back confirms discarded edits and leaves saved rows unchanged', () => {
  const h = harness([post('one')]);
  h.button('New Post').props.onClick(); h.render(); assert.equal(h.nodes().filter((node) => node.type === 'composer').length, 1);
  h.button('Back to posts').props.onClick(); h.render(); assert.ok(h.button('New Post'));
  h.button('Edit Post one').props.onClick(); h.render(); h.change('Article title', 'Unsaved title'); h.render();
  const priorWindow = globalThis.window;
  try {
    globalThis.window = { confirm: () => false }; h.button('Back to posts').props.onClick(); h.render(); assert.ok(h.button('Save draft'));
    globalThis.window.confirm = () => true; h.button('Back to posts').props.onClick(); h.render(); assert.ok(h.button('Edit Post one')); assert.equal(h.text().includes('Unsaved title'), false);
  } finally { globalThis.window = priorWindow; }
});

test('failed publication retains the saved draft and retry updates its existing ID', async () => {
  const saves = []; let attempts = 0;
  const h = harness([], { saveBlogPostDraft: async (data) => { saves.push(data); return { success: true, id: 'saved', message: 'Saved' }; }, publishBlogPost: async () => ({ success: ++attempts > 1, message: attempts === 1 ? 'Publication failed' : 'Published' }) });
  h.button('New Post').props.onClick(); h.render(); h.change('Article title', 'My new article'); h.render(); h.change('article-slug', 'my-new-article'); h.render();
  await h.button('Save & publish').props.onClick(); h.render(); assert.ok(h.text().includes('Publication failed')); assert.ok(h.button('Save draft')); assert.equal(saves[0].id, undefined);
  await h.button('Save & publish').props.onClick(); h.render(); assert.equal(saves[1].id, 'saved'); assert.ok(h.button('Unpublish & save draft'));
  h.button('Back to posts').props.onClick(); h.render(); assert.equal(h.rows().length, 1); assert.ok(h.button('Edit My new article')); assert.ok(h.nodes().some((node) => node.type === 'a' && node.props.href === '/blog/my-new-article'));
});

test('save errors keep the editor text, while editing published posts explains unpublishing', async () => {
  const h = harness([post('live', 'PUBLISHED')], { saveBlogPostDraft: async () => ({ success: false, message: 'Please supply a slug' }) });
  h.button('Edit Post live').props.onClick(); h.render(); assert.ok(h.button('Unpublish & save draft')); assert.ok(h.text().includes('Saving it as a draft removes it from the public blog.'));
  h.change('Article title', 'Keep these edits'); h.render(); await h.button('Save & publish').props.onClick(); h.render(); assert.equal(h.nodes().find((node) => node.props.placeholder === 'Article title').props.value, 'Keep these edits'); assert.ok(h.text().includes('Please supply a slug'));
});
