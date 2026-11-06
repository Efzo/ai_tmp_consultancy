import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require = createRequire(import.meta.url);
function load(file, mocks = {}) {
  const js = ts.transpileModule(readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
  const exports = {};
  new Function('require', 'exports', js)((name) => name in mocks ? mocks[name] : require(name), exports);
  return exports;
}
const helpers = load('src/lib/blog-image-upload.ts');
const pathname = 'media/blog/owner/12345678-1234-1234-1234-123456789abc/photo-random.png';
const metadata = { pathname, userId: 'owner', filename: 'photo.png', alt: 'Customer workspace' };
const blob = { pathname, url: `https://store.private.blob.vercel-storage.com/${pathname}`, contentType: 'image/png', size: 7 * 1024 * 1024 };

test('plain-text oversized responses produce a useful message instead of a JSON parser error', async () => {
  await assert.rejects(helpers.readUploadResponse(new Response('Request Entity Too Large', { status: 413 })), /too large/i);
  await assert.rejects(helpers.readUploadResponse(new Response('<html>Service unavailable</html>', { status: 502 })), /article text is unchanged/);
  await assert.rejects(helpers.readUploadResponse(new Response('null')), /unexpected response/);
  await assert.rejects(helpers.readUploadResponse(Response.json({ message: 'Please sign in.' }, { status: 401 })), /Please sign in/);
  assert.deepEqual(await helpers.readUploadResponse(Response.json({ asset: { id: 'image' } })), { asset: { id: 'image' } });
});

test('registration verifies private storage metadata and is idempotent, including a 7 MB image', async () => {
  let current = blob; const records = new Map();
  const { registerBlogImage } = load('src/lib/register-blog-image.ts', {
    '@vercel/blob': { head: async (path) => { assert.equal(path, pathname); return current; } },
    '@/lib/blog-image-upload': helpers,
    '@/lib/prisma': { prisma: { mediaAsset: { upsert: async ({ where, create }) => { if (!records.has(where.storageKey)) records.set(where.storageKey, { id: 'image', ...create }); return records.get(where.storageKey); } } } },
  });
  assert.equal((await registerBlogImage(metadata)).id, 'image');
  assert.equal((await registerBlogImage(metadata)).id, 'image'); assert.equal(records.size, 1);
  assert.equal(records.get(pathname).uploadedById, 'owner');
  await assert.rejects(registerBlogImage({ ...metadata, userId: 'other-user' }), /Invalid image path/);
  for (const patch of [{ contentType: 'image/svg+xml' }, { size: 11 * 1024 * 1024 }, { pathname: 'private/document.pdf' }, { url: 'https://store.public.blob.vercel-storage.com/image' }]) {
    current = { ...blob, ...patch }; await assert.rejects(registerBlogImage(metadata), /Invalid image upload/);
  }
  assert.equal(records.size, 1);
});

function request(body) { return new Request('https://example.com/api/admin/media/image-upload', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.com' }, body: JSON.stringify(body) }); }

test('client upload grants are authenticated, private-path scoped, type/size limited, and never permit overwrite', async () => {
  const saved = { ...process.env };
  Object.assign(process.env, { BLOB_READ_WRITE_TOKEN: 'configured', DATABASE_URL: 'configured', DEMO_MODE: 'false' });
  let user = null, grant, callback, callbacks = 0;
  const route = load('src/app/api/admin/media/image-upload/route.ts', {
    'next-auth': { getServerSession: async () => ({ user }) }, '@/lib/auth': {}, '@/lib/blog-image-upload': helpers,
    '@/lib/register-blog-image': { registerBlogImage: async (value) => { assert.deepEqual(value, metadata); callbacks++; } },
    '@vercel/blob/client': { handleUpload: async (options) => {
      if (options.body.type === 'blob.generate-client-token') { grant = await options.onBeforeGenerateToken(options.body.payload.pathname, JSON.stringify({ filename: metadata.filename, alt: metadata.alt })); callback = options.onUploadCompleted; return { clientToken: 'restricted-test-token' }; }
      throw new Error('Invalid callback signature');
    } },
  });
  const body = (path = pathname) => ({ type: 'blob.generate-client-token', payload: { pathname: path, multipart: false } });
  try {
    assert.equal((await route.POST(request(body()))).status, 401);
    user = { id: 'owner', role: 'VIEWER' }; assert.equal((await route.POST(request(body()))).status, 401);
    user.role = 'EDITOR'; assert.equal((await route.POST(request(body(pathname.replace('/owner/', '/other/'))))).status, 400);
    assert.equal((await route.POST(request(body()))).status, 200);
    assert.equal(grant.maximumSizeInBytes, 10 * 1024 * 1024); assert.equal(grant.allowOverwrite, false); assert.equal(grant.addRandomSuffix, true);
    assert.ok(grant.allowedContentTypes.includes('image/png')); assert.ok(!grant.allowedContentTypes.includes('image/svg+xml'));
    assert.equal(JSON.parse(grant.tokenPayload).userId, 'owner');
    await callback({ blob, tokenPayload: grant.tokenPayload }); assert.equal(callbacks, 1);
    user = null;
    assert.equal((await route.POST(request({ type: 'blob.upload-completed', payload: {} }))).status, 500); assert.equal(callbacks, 1, 'forged callbacks never register an asset');
  } finally { process.env = saved; }
});

test('completion endpoint rejects foreign/private-document paths before consulting storage', async () => {
  let user = { id: 'owner', role: 'OWNER' }, calls = 0;
  const route = load('src/app/api/admin/media/image-upload/complete/route.ts', {
    'next-auth': { getServerSession: async () => ({ user }) }, '@/lib/auth': {}, '@/lib/blog-image-upload': helpers,
    '@/lib/register-blog-image': { registerBlogImage: async () => { calls++; return { id: 'image' }; } },
  });
  const body = { pathname, filename: metadata.filename, alt: metadata.alt };
  assert.equal((await route.POST(request({ ...body, pathname: 'private/invoice.pdf' }))).status, 400);
  assert.equal((await route.POST(request({ ...body, pathname: pathname.replace('/owner/', '/other/') }))).status, 400); assert.equal(calls, 0);
  assert.equal((await route.POST(request(body))).status, 200); assert.equal(calls, 1);
  user = null; assert.equal((await route.POST(request(body))).status, 401);
});

function uploader(props, mocks) {
  const state = [], refs = []; let cursor = 0, refCursor = 0;
  const react = { ...require('react'), useState: (initial) => { const index = cursor++; if (!(index in state)) state[index] = initial; return [state[index], (next) => { state[index] = typeof next === 'function' ? next(state[index]) : next; }]; }, useRef: (initial) => { const index = refCursor++; return refs[index] ||= { current: initial }; } };
  const Component = load('src/components/admin/BlogImageUpload.tsx', { react, '@/lib/blog-image-upload': helpers, ...mocks }).default;
  return () => {
    cursor = refCursor = 0; const tree = Component(props), nodes = [];
    const visit = (node) => { if (!node?.props) return; nodes.push(node); for (const child of [node.props.children].flat(Infinity)) visit(child); }; visit(tree);
    return { file: nodes.find((node) => node.props.type === 'file'), alt: nodes.find((node) => node.type === 'input' && node.props.maxLength === 300), caption: nodes.find((node) => node.type === 'input' && node.props.maxLength === 500), button: nodes.find((node) => node.type === 'button'), status: nodes.find((node) => node.props.role === 'status') };
  };
}

test('large images go directly to Blob and attachment retry does not upload the bytes twice', async () => {
  const originalFetch = globalThis.fetch, originalCrypto = globalThis.crypto;
  let uploads = 0, requests = 0, attached;
  const busy = [];
  const render = uploader({ label: 'Upload & insert at cursor', disabled: false, onBusy: (value) => busy.push(value), onUploaded: (image) => { attached = image; } }, {
    'next-auth/react': { getSession: async () => ({ user: { id: 'owner' } }) },
    '@vercel/blob/client': { upload: async (path, file, options) => { uploads++; assert.equal(file.size, 7 * 1024 * 1024); assert.equal(options.access, 'private'); assert.equal(options.handleUploadUrl, '/api/admin/media/image-upload'); assert.ok(path.startsWith('media/blog/owner/')); return { pathname }; } },
  });
  globalThis.fetch = async (url, options) => { requests++; assert.equal(url, '/api/admin/media/image-upload/complete'); assert.equal(typeof options.body, 'string'); assert.ok(options.body.length < 1000, 'file bytes never pass through the function'); return requests === 1 ? new Response('Request Entity Too Large', { status: 413 }) : Response.json({ asset: { id: 'attached' } }); };
  try {
    render().file.props.onChange({ target: { files: [new File([new Uint8Array(7 * 1024 * 1024)], 'large.png', { type: 'image/png' })] } });
    render().alt.props.onChange({ target: { value: 'Customer workspace' } });
    render().caption.props.onChange({ target: { value: 'Workspace overview.' } });
    await render().button.props.onClick(); assert.match(render().status.props.children, /too large/i); assert.equal(attached, undefined);
    await render().button.props.onClick(); assert.equal(uploads, 1); assert.equal(requests, 2);
    assert.deepEqual(attached, { url: '/api/media/attached', alt: 'Customer workspace', caption: 'Workspace overview.' });
    assert.deepEqual(busy, [true, false, true, false]);
  } finally { globalThis.fetch = originalFetch; if (globalThis.crypto !== originalCrypto) globalThis.crypto = originalCrypto; }
});
