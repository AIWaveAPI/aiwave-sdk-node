# AIWave Node.js SDK

**One OpenAI-compatible API for Chinese AI models — and AI video. 128 live routes, 9 families, 13 video generation routes.**

[![npm version](https://img.shields.io/npm/v/aiwave)](https://www.npmjs.com/package/aiwave)
[![Models](https://img.shields.io/badge/models-128%20live%20routes-blue)](https://aiwave.live/models)
[![Video](https://img.shields.io/badge/video-13%20generation%20routes-purple)](https://aiwave.live/models)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

AIWave gives developers one OpenAI-compatible API route for Chinese AI model families — DeepSeek, GLM, Kimi, Qwen, ERNIE, MiniMax, Doubao, StepFun, MiMo — plus AI video routes (Kling, Seedance, Hailuo, Wan, Vidu).

Get a key at [aiwave.live/register](https://aiwave.live/register) — free tier included.

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
