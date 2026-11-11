const OpenAI = require('openai');
const { performance } = require('node:perf_hooks');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * AIWave video generation routes.
 *
 * Video routes are experimental and require an eligible paid account group.
 * Completion time varies; poll `status()` and retain the task ID.
 */
class VideoAPI {
  constructor(client) {
    this._client = client;
  }

  /**
   * Submit a video generation job.
   * @returns {Promise<{taskId: string, status: string, raw: object}>}
   */
  async generate({ model = 'kling-v2-6', prompt, ...rest } = {}) {
    if (typeof prompt !== 'string' || !prompt.trim()) {
      throw new Error('prompt must be a non-empty string');
    }
    const resp = await this._client.post('/video/generations', {
      body: { model, prompt, ...rest },
      // A transient response does not prove the provider rejected a paid job.
      maxRetries: 0,
    });
    const data = resp?.data ?? resp;
    const taskId = data?.task_id ?? data?.id;
    if (typeof taskId !== 'string' || !taskId) {
      throw new Error(
        'Video submission returned no task ID; check task history and usage ' +
          'before submitting another paid job.'
      );
    }
    return {
      taskId,
      status: data?.status ?? 'queued',
      raw: data,
    };
  }

  /**
   * Check a video job's status.
   * @returns {Promise<{status: string, progress: string, raw: object}>}
   */
  async status(taskId) {
    if (typeof taskId !== 'string' || !taskId) {
      throw new Error('status requires a non-empty task ID');
    }
    const resp = await this._client.get(`/video/generations/${encodeURIComponent(taskId)}`);
    const data = resp?.data ?? resp;
    return {
      status: data?.status ?? 'unknown',
      progress: data?.progress ?? '',
      raw: data,
    };
  }

  /**
   * Poll a job until it succeeds, fails, or times out.
   * @param {string} taskId
   * @param {{interval?: number, timeout?: number, poll?: boolean}} opts
   * interval is 1,000–2,147,483,647 milliseconds; timeout is non-negative.
   */
  async wait(taskId, { interval = 15000, timeout = 900000, poll = true } = {}) {
    if (!poll) return this.status(taskId);
    // Node clamps overflowing timers to 1 ms, which would flood status GETs.
    if (typeof interval !== 'number' || !Number.isFinite(interval) ||
        interval < 1000 || interval > 2147483647) {
      throw new Error('interval must be a finite number from 1000 to 2147483647 milliseconds');
    }
    if (typeof timeout !== 'number' || !Number.isFinite(timeout) || timeout < 0) {
      throw new Error('timeout must be a finite non-negative number of milliseconds');
    }
    const deadline = performance.now() + timeout;
    while (performance.now() < deadline) {
      const st = await this.status(taskId);
      // Generic tasks use SUCCESS/FAILURE; realtime and video adapters can
      // return succeeded/failed or completed/failed for the same task lifecycle.
      const status = typeof st.status === 'string' ? st.status.toLowerCase() : '';
      if (status === 'success' || status === 'succeeded' || status === 'completed') return st;
      if (status === 'failure' || status === 'failed') {
        throw new Error(`Video generation failed upstream: ${st.raw?.fail_reason ?? 'unknown'}`);
      }
      await sleep(Math.min(interval, Math.max(0, deadline - performance.now())));
    }
    throw new Error(
      `Video job ${taskId} did not finish within ${timeout / 1000}s. ` +
        'Keep the task ID and check its status and usage before submitting another paid job.'
    );
  }
}

/**
 * AIWave API client — OpenAI compatible.
 * Get your API key at https://aiwave.live
 */
class AIWave extends OpenAI {
  constructor(options = {}) {
    const apiKey = options.apiKey === undefined ? process.env.AIWAVE_API_KEY : options.apiKey;
    if (typeof apiKey !== 'string' || !apiKey.trim()) {
      throw new Error('AIWave API key required. Pass apiKey or set AIWAVE_API_KEY.');
    }
    super({
      ...options,
      apiKey,
      baseURL: options.baseURL || 'https://aiwave.live/v1',
    });
    this.video = new VideoAPI(this);
  }
}

module.exports = AIWave;
module.exports.AIWave = AIWave;
module.exports.VideoAPI = VideoAPI;
