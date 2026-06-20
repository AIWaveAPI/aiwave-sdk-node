// Streaming chat completion example
const AIWave = require('aiwave');

const client = new AIWave({ apiKey: '***' });

async function main() {
  const stream = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [{ role: 'user', content: 'Write a short poem about AI' }],
    stream: true
  });

  console.log('Streaming response:\n');
  for await (const chunk of stream) {
    if (chunk.choices[0]?.delta?.content) {
      process.stdout.write(chunk.choices[0].delta.content);
    }
  }
  console.log();
}

main().catch(console.error);
