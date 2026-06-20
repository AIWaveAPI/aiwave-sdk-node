# AIWave Model Reference

Full list of supported models and their capabilities.

**[Get API key ¡ú](https://aiwave.live)**

## DeepSeek

| Model | Context | Type |
|-------|---------|------|
| `deepseek-v4-pro` | 128K | Chat |
| `deepseek-chat` | 64K | Chat |
| `deepseek-reasoner` | 64K | Reasoning |

## GLM

| Model | Context | Type |
|-------|---------|------|
| `glm-5.1` | 128K | Chat |
| `glm-5` | 128K | Chat |
| `glm-4-flash` | 128K | Budget |

## Kimi

| Model | Context | Type |
|-------|---------|------|
| `kimi-vl-a3b-thinking` | 128K | Vision |
| `kimi-thinking` | 128K | Reasoning |

## ERNIE

| Model | Context |
|-------|---------|
| `ernie-4.5` | 128K |
| `ernie-speed` | 8K |

## Qwen

| Model | Context |
|-------|---------|
| `qwen-3` | 128K |
| `qwen-3-vl` | 128K |

*50+ more models. [View full pricing ¡ú](https://aiwave.live/pricing)*

All models use the OpenAI-compatible API:

```js
const client = new AIWave({ apiKey: '***' });
const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: 'Hello!' }]
});
```
