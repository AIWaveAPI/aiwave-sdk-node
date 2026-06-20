// Basic chat completion example using AIWave SDK
const AIWave = require('aiwave');

const client = new AIWave({ apiKey: '***' });

async function main() {
  // List models
  const models = await client.models.list();
  console.log('Available models (first 10):');
  models.data.slice(0, 10).forEach(m => {
    console.log(`  ${m.id.padEnd(30)} | ${m.owned_by}`);
  });

  // Chat completion
  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: 'You are a helpful AI assistant.' },
      { role: 'user', content: 'Explain quantum entanglement in one paragraph.' }
    ],
    temperature: 0.7,
    max_tokens: 500
  });

  console.log('\n' + '='.repeat(60));
  console.log('Response:');
  console.log(response.choices[0].message.content);
  console.log(`\nModel: ${response.model}, Tokens: ${response.usage.total_tokens}`);
}

main().catch(console.error);
