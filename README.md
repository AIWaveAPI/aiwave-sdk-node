# AIWave Node.js SDK

**One OpenAI-compatible API for Chinese AI models — and AI video. 97 public routes, 10 Chinese families, 13 public video routes.**

[![npm version](https://img.shields.io/npm/v/aiwave)](https://www.npmjs.com/package/aiwave)
[![Models](https://img.shields.io/badge/public%20rate%20card-97%20routes-blue)](https://aiwave.live/models)
[![Video](https://img.shields.io/badge/public%20video%20routes-13-purple)](https://aiwave.live/models)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

AIWave gives developers one OpenAI-compatible API route for Chinese AI model families — DeepSeek, GLM, Kimi, Qwen, MiniMax, Doubao, StepFun, MiMo — plus AI video routes (Kling, Seedance, Hailuo, Wan, Vidu).

Get a key at [aiwave.live/register](https://aiwave.live/register).

Use this SDK when you want a Node.js client path to AIWave while keeping model IDs, dated USD rates, and request-level usage evidence visible during testing.

## Installation

```bash
npm install aiwave
```

## Quick start with the AIWave client

```js
import AIWave from 'aiwave';

const client = new AIWave({ apiKey: process.env.AIWAVE_API_KEY });

const response = await client.chat.completions.create({
  model: 'deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Hello' }],
});

console.log(response.choices[0].message.content);
console.log(response.usage);
```

Store API keys outside source control. The example above uses an environment variable and does not include a real key.

## OpenAI-compatible client path

For supported chat requests, you can also use the official OpenAI Node.js client with the AIWave base URL:

```js
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.AIWAVE_API_KEY,
  baseURL: 'https://aiwave.live/v1',
});

const response = await client.chat.completions.create({
  model: 'deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Hello' }],
});

console.log(response.usage);
```

## AI video

One key, video routes on Kling, Seedance, Hailuo, Wan and Vidu.

```js
const AIWave = require('aiwave');

const client = new AIWave({ apiKey: 'YOUR_API_KEY_HERE' });

const job = await client.video.generate({
  model: 'kling-v2-6',
  prompt: 'A red sports car drifting through a neon-lit city at night, cinematic tracking shot',
});
console.log(job.taskId);

const done = await client.video.wait(job.taskId);  // polls every 15s, 15 min max
console.log(done.status);
```

Video routes are experimental and need an eligible paid account group.
Completion time varies. Keep the task ID and check its status and usage before
submitting another paid job if polling times out.

## What to verify before production

- Confirm the current model ID in the [AIWave model catalog](https://aiwave.live/models/).
- Check the dated USD rates on the [AIWave pricing page](https://aiwave.live/pricing).
- Run one representative workload and review the request-level usage record.
- Keep timeout, retry, privacy, and model-quality acceptance checks in your own application.

## Resources

- [AIWave home](https://aiwave.live/)
- [Live pricing and model catalog](https://aiwave.live/pricing)
- [API docs](https://aiwave.live/docs/)
- [Developer field notes](https://aiwave.live/blog/)
- [Python SDK](https://github.com/AIWaveAPI/aiwave-sdk-python)

## License

MIT
