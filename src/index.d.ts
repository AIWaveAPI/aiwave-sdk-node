import OpenAI from 'openai';

declare class AIWave extends OpenAI {
  constructor(options?: {
    apiKey?: string;
    baseURL?: string;
    [key: string]: any;
  });

  video: AIWave.VideoAPI;
}

declare namespace AIWave {
  export interface VideoJob {
    taskId: string;
    status: string;
    raw: any;
  }

  export interface VideoStatus {
    status: string;
    progress: string;
    raw: any;
  }

  export interface VideoWaitOptions {
    /** Milliseconds between polls (default 15000) */
    interval?: number;
    /** Total milliseconds to wait (default 900000 = 15 min) */
    timeout?: number;
    /** If false, return current status without polling */
    poll?: boolean;
  }

  export class VideoAPI {
    /** Submit a video generation job. */
    generate(params: {
      model?: string;
      prompt: string;
      [key: string]: any;
    }): Promise<VideoJob>;

    /** Check a video job's status. */
    status(taskId: string): Promise<VideoStatus>;

    /** Poll a job until it succeeds, fails, or times out. */
    wait(taskId: string, opts?: VideoWaitOptions): Promise<VideoStatus>;
  }
}

export = AIWave;

