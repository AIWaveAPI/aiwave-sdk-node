// ESM import example
import AIWave from 'aiwave';

const client = new AIWave({ apiKey: '***' });

const response = await client.chat.completions.create({
  model: 'deepseek-chat',
  messages: [{ role: 'user', content: 'Hello in 5 different languages' }]
});

console.log(response.choices[0].message.content);
