const OpenAI = require('openai');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * AIWave video generation routes.
 *
 * Video routes are experimental and require a paid account group (from $5).
 * A single shot takes 5-11 minutes; poll `status()` until it reports success.
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
    if (!prompt) throw new Error('prompt is required');
    const resp = await this._client.post('/video/generations', {
      body: { model, prompt, ...rest },
    });
    const data = resp?.data ?? resp;
    return {
      taskId: data?.task_id ?? data?.id,
      status: data?.status ?? 'queued',
      raw: data,
    };
  }

  /**
   * Check a video job's status.
   * @returns {Promise<{status: string, progress: string, raw: object}>}
   */
  async status(taskId) {
    const resp = await this._client.get(`/video/generations/${taskId}`);
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
   */
  async wait(taskId, { interval = 15000, timeout = 900000, poll = true } = {}) {
    if (!poll) return this.status(taskId);
    const deadline = Date.now() + timeout;
    while (Date.now() < deadline) {
      const st = await this.status(taskId);
      if (st.status === 'SUCCESS') return st;
      if (st.status === 'FAILURE') {
        throw new Error(`Video generation failed upstream: ${st.raw?.fail_reason ?? 'unknown'}`);
      }
      await sleep(interval);
    }
    throw new Error(
      `Video job ${taskId} did not finish within ${timeout / 1000}s. ` +
        'Single shots take 5-11 minutes; if it stays at 0% progress for over 3 minutes, ' +
        'the upstream channel likely failed — submit again.'
    );
  }
}

/**
 * AIWave API client — OpenAI compatible.
 * Get your API key at https://aiwave.live
 */
class AIWave extends OpenAI {
  constructor(options = {}) {
    const apiKey = options.apiKey || process.env.AIWAVE_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('API key required. Get your API key at https://aiwave.live');
    }
    super({
      apiKey,
      baseURL: options.baseURL || 'https://aiwave.live/v1',
      ...options
    });
    this.video = new VideoAPI(this);
  }
}

module.exports = AIWave;
module.exports.AIWave = AIWave;
module.exports.VideoAPI = VideoAPI;
