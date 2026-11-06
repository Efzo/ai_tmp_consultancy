import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { JSDOM } from 'jsdom';
const exports = {};
new Function('exports', ts.transpileModule(readFileSync(new URL('../src/lib/blog-editor-images.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText)(exports);
const { insertBlogImage, moveBlogImage } = exports;
const image = { url: '/api/media/photo', alt: 'Customer workspace', caption: 'Workspace overview.' };
function setup(html) { const dom = new JSDOM(`<div id="editor">${html}</div>`); return { document: dom.window.document, editor: dom.window.document.querySelector('#editor') }; }

test('inserting an image at the caret splits a paragraph and preserves text on both sides', () => {
  const { document, editor } = setup('<p>Before <strong>and after</strong></p>');
  const range = document.createRange(); range.setStart(editor.querySelector('strong').firstChild, 4); range.collapse(true);
  const next = insertBlogImage(editor, range, image);
  assert.deepEqual([...editor.children].map((node) => node.tagName), ['P', 'FIGURE', 'P']);
  assert.equal(editor.children[0].textContent, 'Before and ');
  assert.equal(editor.children[2].textContent, 'after');
  assert.equal(editor.children[2].querySelector('strong').textContent, 'after');
  assert.equal(editor.querySelector('img').getAttribute('src'), '/api/admin/media/photo');
  assert.equal(editor.querySelector('figcaption').textContent, image.caption);
  assert.equal(next.startContainer, editor.children[2]); assert.equal(next.collapsed, true);
});

test('no caret appends the image with a paragraph ready for continued writing', () => {
  const { editor } = setup('<p>Existing story</p>');
  const next = insertBlogImage(editor, null, image);
  assert.equal(editor.firstElementChild.textContent, 'Existing story');
  assert.equal(editor.children[1].tagName, 'FIGURE');
  assert.equal(editor.lastElementChild.tagName, 'P');
  assert.equal(next.startContainer, editor.lastElementChild);
  assert.ok(editor.lastElementChild.querySelector('br'));
});

test('list insertion keeps valid list structure and image moves keep surrounding paragraphs intact', () => {
  const { editor, document } = setup('<ul><li>First part</li><li>Next item</li></ul><p>Closing paragraph</p>');
  const range = document.createRange(); range.setStart(editor.querySelector('li').firstChild, 5); range.collapse(true);
  const next = insertBlogImage(editor, range, image);
  assert.equal(next.startContainer.tagName, "LI");
  assert.deepEqual([...editor.children].map((node) => node.tagName), ['UL', 'FIGURE', 'UL', 'P']);
  const figure = editor.querySelector('figure');
  assert.equal(moveBlogImage(figure, 'up'), true); assert.equal(editor.firstElementChild, figure);
  assert.equal(moveBlogImage(figure, 'up'), false);
  assert.equal(moveBlogImage(figure, 'down'), true);
  assert.equal(editor.lastElementChild.textContent, 'Closing paragraph');
  assert.equal(editor.querySelectorAll('li').length, 3);
});

test('an old detached cursor is ignored and adding after an image never nests figures', () => {
  const { editor, document } = setup('<p>Story</p>');
  const detached = document.createElement('p'); detached.textContent = 'Old text';
  const old = document.createRange(); old.selectNodeContents(detached); old.collapse(false);
  insertBlogImage(editor, old, image);
  const figure = editor.querySelector('figure');
  const range = document.createRange(); range.selectNodeContents(figure); range.collapse(false);
  insertBlogImage(editor, range, { ...image, url: '/api/media/second' });
  assert.equal(editor.querySelectorAll('figure').length, 2);
  assert.equal(editor.querySelector('figure figure'), null);
  assert.equal(editor.firstElementChild.textContent, 'Story');
});
