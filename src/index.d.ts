import OpenAI from 'openai';

declare class AIWave extends OpenAI {
  constructor(options?: {
    apiKey?: string;
    baseURL?: string;
    [key: string]: any;
  });
}

export = AIWave;
