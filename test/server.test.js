import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../server.js';
let server, base;
before(async () => {
  server = createServer();
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});
after(() => new Promise(resolve => server.close(resolve)));
test('health probe returns machine-readable status without caching', async () => {
  const res = await fetch(`${base}/health`);
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('cache-control'), 'no-store');
  const body = await res.json();
  assert.equal(body.status, 'healthy');
  assert.equal(typeof body.uptimeSeconds, 'number');
  assert.ok(Number.isFinite(Date.parse(body.timestamp)));
});
test('dashboard and all required assets are served', async () => {
  for (const [path, type] of [['/', 'text/html'], ['/style.css', 'text/css'], ['/app.js', 'text/javascript']]) {
    const res = await fetch(base + path);
    assert.equal(res.status, 200);
    assert.ok(res.headers.get('content-type').startsWith(type));
    assert.ok((await res.text()).length > 0);
  }
});
test('status API reflects configured release and environment', async () => {
  const body = await (await fetch(`${base}/api/status`)).json();
  assert.equal(body.version, process.env.APP_VERSION || '1.0.0');
  assert.equal(body.environment, process.env.APP_ENV || 'local');
});
test('unknown paths cannot expose project source', async () => {
  for (const path of ['/server.js', '/package.json', '/missing', '/%2e%2e/server.js']) {
    assert.equal((await fetch(base + path)).status, 404);
  }
});
test('write requests are rejected', async () => {
  const res = await fetch(`${base}/health`, { method: 'POST' });
  assert.equal(res.status, 405);
  assert.equal(res.headers.get('allow'), 'GET, HEAD');
});
test('HEAD reports health without a response body', async () => {
  const res = await fetch(`${base}/health`, { method: 'HEAD' });
  assert.equal(res.status, 200);
  assert.equal(await res.text(), '');
});
