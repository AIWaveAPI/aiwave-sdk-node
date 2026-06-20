# AIWave Node.js SDK

**One API key for 50+ Chinese AI models — OpenAI compatible, zero code changes.**

[![npm version](https://img.shields.io/npm/v/aiwave)](https://www.npmjs.com/package/aiwave)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## Installation

```bash
npm install aiwave
```

## Quick Start

```js
import AIWave from 'aiwave';

const client = new AIWave({ apiKey: 'sk-your-key-here' });

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: 'Explain quantum computing briefly' }]
});
console.log(response.choices[0].message.content);
```

## Drop-in OpenAI Replacement

```js
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: 'sk-your-key-here',
  baseURL: 'https://aiwave.live/v1'
});
// All your existing code works
```

## Why AIWave?

- **One API key** for 50+ models — no per-model registration
- **Pay-as-you-go** — only pay what you use
- **Start free** — free credits on signup
- **OpenAI compatible** — zero code changes

**[Get your API key →](https://aiwave.live)**

## License
MIT
