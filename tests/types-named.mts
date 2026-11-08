import type { VideoJob, VideoStatus, VideoWaitOptions, VideoAPI } from '../src/index.js';
let job!: VideoJob;
let status!: VideoStatus;
let opts!: VideoWaitOptions;
let api!: VideoAPI;
void job; void status; void opts; void api;

import { AIWave, VideoAPI as VideoAPIClass } from '../src/index.js';
const client = new AIWave({ apiKey: 'synthetic-only' });
const video = new VideoAPIClass(client);
const submitted: Promise<VideoJob> = video.generate({ prompt: 'synthetic prompt' });
void submitted;
