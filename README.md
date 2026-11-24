# AIWave Node.js SDK

**OpenAI-compatible chat for catalog-listed model IDs, with video on a separate API path.**

[![npm version](https://img.shields.io/npm/v/aiwave)](https://www.npmjs.com/package/aiwave)
[![Models](https://img.shields.io/badge/model%20IDs-91-blue)](https://aiwave.live/models)
[![Video](https://img.shields.io/badge/video%20IDs-13-purple)](https://aiwave.live/models)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

The live card lists 91 model IDs on the public rate card across 10 Chinese
model families and international providers. Of those 91 IDs, 13 video IDs on
the public rate card are for video generation, so the video count is a subset
and not an additional 13. Chat requests use the OpenAI-compatible path below;
video jobs use separate `/video/generations` methods and are not Chat
Completions requests.

These counts describe catalog-listed IDs only. They are not access for a
particular key and not live route health; test the exact model and operation
before production use.

Get a key at [aiwave.live/register](https://aiwave.live/register).

Set `AIWAVE_API_KEY` through the secure shell setup in the
[Quickstart](https://github.com/AIWaveAPI/aiwave-quickstart#1-set-your-environment),
then run the examples below. The client throws if neither an explicit `apiKey`
nor `AIWAVE_API_KEY` is set.

Use this client for the supported chat methods below. It also exposes the
experimental video job methods shown later in this README.

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

Store API keys outside source control. The example above uses an environment variable and does not include a real key. The AIWave client accepts an explicit `apiKey` or `AIWAVE_API_KEY`; it never takes `OPENAI_API_KEY` from another provider's environment.

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

Video routes on Kling, Seedance, Hailuo, Wan and Vidu use the same key but a
separate API path from chat. Video IDs are a subset of the 91 catalog IDs; not
every video ID bills the same way. `kling-v2-6` is per-call, while some
Seedance IDs are token-priced. Check `quota_type` in the live card before
estimating spend.

Save this as `video.mjs` and run it with `node video.mjs`:

```js
import AIWave from 'aiwave';

const client = new AIWave({ apiKey: process.env.AIWAVE_API_KEY });

const job = await client.video.generate({
  model: 'kling-v2-6',
  prompt: 'A red sports car drifting through a neon-lit city at night, cinematic tracking shot',
});
console.log(job.taskId);

const done = await client.video.wait(job.taskId);  // polls every 15s, 15 min max
console.log(done.status);
```

`import` rather than `require` is required for the top-level `await` above. A
CommonJS script works too, but it must wrap the calls in an async function.

Video routes are experimental and need an eligible paid account group.
Completion time varies. The video submission method makes one POST and disables
automatic SDK retries, including for 429 and 5xx responses. A timeout or
transient error may still leave the outcome uncertain: check task history and
usage before submitting another paid job. Keep the task ID if one was returned.
Custom polling intervals must be 1,000–2,147,483,647 milliseconds; invalid
intervals and non-finite timeouts are rejected before a status request.

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
