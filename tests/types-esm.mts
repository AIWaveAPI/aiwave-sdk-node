import AIWave from '../src/index.js';

const client = new AIWave({ apiKey: 'synthetic-only' });
const job: AIWave.VideoJob = { taskId: 'synthetic-task', status: 'queued', raw: {} };
const submitted: Promise<AIWave.VideoJob> = client.video.generate({ prompt: 'synthetic prompt' });
const status: Promise<AIWave.VideoStatus> = client.video.wait(job.taskId);

void submitted;
void status;

