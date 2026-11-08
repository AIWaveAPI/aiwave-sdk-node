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
      seen.push([options.method, new URL(url).pathname]);
      const body = options.method === 'POST' ? submit : poll;
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

test('missing task ID is not treated as successful submission', async () => {
  const { client } = clientWithResponses({ data: { status: 'IN_PROGRESS' } });
  await assert.rejects(
    client.video.generate({ model: 'synthetic-model', prompt: 'synthetic prompt' }),
    /task ID.*check task history and usage/
  );
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
