const test = require('node:test');
const assert = require('node:assert/strict');
const AIWave = require('../src/index.js');

function withKeys(values, run) {
  const priorAIWave = process.env.AIWAVE_API_KEY;
  const priorOpenAI = process.env.OPENAI_API_KEY;
  try {
    delete process.env.AIWAVE_API_KEY;
    delete process.env.OPENAI_API_KEY;
    Object.assign(process.env, values);
    run();
  } finally {
    if (priorAIWave === undefined) delete process.env.AIWAVE_API_KEY;
    else process.env.AIWAVE_API_KEY = priorAIWave;
    if (priorOpenAI === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = priorOpenAI;
  }
}

test('another provider key alone is rejected', () => {
  withKeys({ OPENAI_API_KEY: 'synthetic-other-provider' }, () => {
    assert.throws(() => new AIWave(), /AIWave API key/);
  });
});

test('AIWave environment key is used even if another provider key exists', () => {
  withKeys({ AIWAVE_API_KEY: 'synthetic-aiwave',
    OPENAI_API_KEY: 'synthetic-other-provider' }, () => {
    assert.equal(new AIWave().apiKey, 'synthetic-aiwave');
  });
});

test('explicit key wins, including when an option field is undefined', () => {
  withKeys({ AIWAVE_API_KEY: 'synthetic-env',
    OPENAI_API_KEY: 'synthetic-other-provider' }, () => {
    assert.equal(new AIWave({ apiKey: 'synthetic-explicit' }).apiKey, 'synthetic-explicit');
    assert.equal(new AIWave({ apiKey: undefined }).apiKey, 'synthetic-env');
  });
});
