// Compare multiple models on the same prompt
import AIWave from 'aiwave';

const client = new AIWave({ apiKey: '***' });
const models = ['deepseek-chat', 'glm-5', 'qwen-3'];
const prompt = 'Explain the difference between SQL and NoSQL in 2 sentences.';

async function askModel(model) {
  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }]
  });
  return response.choices[0].message.content;
}

console.log(`Prompt: ${prompt}\n`);
const results = await Promise.all(models.map(askModel));
models.forEach((model, i) => {
  console.log(`=== ${model} ===`);
  console.log(results[i]);
  console.log();
});
