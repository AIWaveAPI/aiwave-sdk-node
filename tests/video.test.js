const test = require('node:test');
const assert = require('node:assert/strict');
const AIWave = require('../src/index.js');

function clientWithResponses(submit, poll) {
  const seen = [];
  const client = new AIWave({
    apiKey: 'synthetic-only',
    baseURL: 'https://example.invalid/v1',
    maxRetries: 0,
    fetch: async (url, options) => {
      const method = options.method.toUpperCase();
      seen.push([method, new URL(url).pathname]);
      const body = method === 'POST' ? submit : poll;
      return new Response(JSON.stringify(body), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    },
  });
  return { client, seen };
}

test('video submission and poll parse nested JSON', async () => {
  const { client, seen } = clientWithResponses(
    { data: { task_id: 'synthetic-task', status: 'IN_PROGRESS' } },
    { data: { status: 'SUCCESS', progress: '100%' } }
  );
  const job = await client.video.generate({ model: 'synthetic-model', prompt: 'synthetic prompt' });
  const state = await client.video.status(job.taskId);
  assert.equal(job.taskId, 'synthetic-task');
  assert.equal(state.status, 'SUCCESS');
  assert.deepEqual(seen, [
    ['POST', '/v1/video/generations'],
    ['GET', '/v1/video/generations/synthetic-task'],
  ]);
});

test('status treats an opaque task ID as one URL path segment', async () => {
  let observed;
  const client = new AIWave({
    apiKey: 'synthetic-only',
    baseURL: 'https://example.invalid/v1',
    maxRetries: 0,
    fetch: async (url) => {
      observed = new URL(url);
      return new Response(JSON.stringify({ data: { status: 'SUCCESS' } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    },
  });
  await client.video.status('job?mode=unsafe#fragment');
  assert.equal(observed.pathname, '/v1/video/generations/job%3Fmode%3Dunsafe%23fragment');
  assert.equal(observed.search, '');
  assert.equal(observed.hash, '');
});

test('status refuses an empty task ID before sending a request', async () => {
  let requests = 0;
  const client = new AIWave({
    apiKey: 'synthetic-only',
    baseURL: 'https://example.invalid/v1',
    fetch: async () => {
      requests += 1;
      throw new Error('request should not be sent');
    },
  });
  await assert.rejects(client.video.status(''), /non-empty task ID/);
  assert.equal(requests, 0);
});

test('missing task ID is not treated as successful submission', async () => {
  const { client } = clientWithResponses({ data: { status: 'IN_PROGRESS' } });
  await assert.rejects(
    client.video.generate({ model: 'synthetic-model', prompt: 'synthetic prompt' }),
    /task ID.*check task history and usage/
  );
});

test('a transient video submission failure is not automatically resubmitted', async () => {
  for (const status of [429, 503]) {
    let posts = 0;
    const client = new AIWave({
      apiKey: 'synthetic-only',
      baseURL: 'https://example.invalid/v1',
      // Deliberately use the OpenAI client's default retry policy.
      fetch: async (_url, options) => {
        if (options.method.toUpperCase() !== 'POST') throw new Error('unexpected polling request');
        posts += 1;
        if (posts === 1) {
          return new Response(JSON.stringify({ error: { message: 'upstream unavailable' } }), {
            status,
            headers: { 'content-type': 'application/json' },
          });
        }
        return new Response(JSON.stringify({ data: { task_id: 'duplicate-paid-job' } }), {
          status: 200,
          headers: { 'content-type': 'application/json' },
        });
      },
    });

    await assert.rejects(client.video.generate({ prompt: 'synthetic prompt' }));
    assert.equal(posts, 1, `HTTP ${status} caused a duplicate video POST`);
  }
});

test('a video submission connection failure is not automatically resubmitted', async () => {
  let posts = 0;
  const client = new AIWave({
    apiKey: 'synthetic-only',
    baseURL: 'https://example.invalid/v1',
    fetch: async () => {
      posts += 1;
      throw new TypeError('synthetic connection failure');
    },
  });

  await assert.rejects(client.video.generate({ prompt: 'synthetic prompt' }));
  assert.equal(posts, 1);
});

test('poll timeout retains the task ID and avoids resubmission advice', async () => {
  const { client } = clientWithResponses({}, {});
  await assert.rejects(client.video.wait('synthetic-task', { timeout: 0 }), (error) => {
    assert.match(error.message, /synthetic-task/);
    assert.match(error.message, /check its status and usage/);
    assert.doesNotMatch(error.message, /submit again/);
    return true;
  });
});
