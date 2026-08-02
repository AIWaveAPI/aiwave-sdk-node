# AIWave Node.js SDK

One API key for 48 Chinese AI models — OpenAI compatible, with a drop-in OpenAI SDK interface.

[![npm version](https://img.shields.io/npm/v/aiwave)](https://www.npmjs.com/package/aiwave)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Live model catalog

The catalog and USD token prices change over time. See the [live AIWave pricing page](https://aiwave.live/pricing) for the current 48-model catalog instead of relying on a hard-coded list.

## Installation

```bash
npm install aiwave
```

## Quick Start

```js
import AIWave from 'aiwave';

const client = new AIWave({ apiKey: 'YOUR_API_KEY_HERE' });

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: 'Explain quantum computing briefly' }]
});
console.log(response.choices[0].message.content);
```

Replace `YOUR_API_KEY_HERE` with a key from [aiwave.live](https://aiwave.live). Never commit a real API key to a repository.

## Drop-in OpenAI Replacement

```js
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'YOUR_API_KEY_HERE',
  baseURL: 'https://aiwave.live/v1'
});
// All your existing code works
```

## Why AIWave?

- **One API key** for 48 Chinese AI models
- **OpenAI compatible** — keep your existing SDK and tools
- **Pay-as-you-go** USD billing
- **$1 free credit** on signup for testing

## Resources

- [Live pricing and model catalog](https://aiwave.live/pricing)
- [AIWave developer blog](https://aiwave.live/blog/)
- [Python SDK](https://github.com/AIWaveAPI/aiwave-sdk-python)
- [Get an API key](https://aiwave.live)

## License

MIT