const OpenAI = require('openai');

/**
 * AIWave API client — OpenAI compatible.
 * Get your API key at https://aiwave.live
 */
class AIWave extends OpenAI {
  constructor(options = {}) {
    const apiKey = options.apiKey || process.env.AIWAVE_API_KEY || process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('API key required. Get one at https://aiwave.live');
    }
    super({
      apiKey,
      baseURL: options.baseURL || 'https://aiwave.live/v1',
      ...options
    });
  }
}

module.exports = AIWave;
