require('dotenv').config();

module.exports = {
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
  model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
  timeout: 30000,
  defaultTemperature: 0.7,
  maxTokens: 2000
};
