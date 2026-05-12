const axios = require('axios');
const config = require('../config/deepseek');
const { getCharacterById } = require('../config/characters');

const client = axios.create({
  baseURL: config.baseURL,
  timeout: config.timeout,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${config.apiKey}`
  }
});

const ALLOWED_CATEGORIES = [
  '学术科普',
  '编程技术',
  'AI/数据科学',
  '财经分析',
  '心理健康',
  '职场压力',
  '健身运动',
  '学习动力',
  '生活方式',
  '反内卷'
];

async function callDeepSeek(messages, { temperature, maxTokens, responseFormat } = {}) {
  const payload = {
    model: config.model,
    messages,
    temperature: typeof temperature === 'number' ? temperature : config.defaultTemperature,
    max_tokens: maxTokens || config.maxTokens
  };
  if (responseFormat === 'json') {
    payload.response_format = { type: 'json_object' };
  }
  const { data } = await client.post('/chat/completions', payload);
  return data.choices?.[0]?.message?.content || '';
}

function safeParseJSON(text, fallback = null) {
  if (!text) return fallback;
  try {
    return JSON.parse(text);
  } catch (_) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (_) {
        return fallback;
      }
    }
    return fallback;
  }
}

async function classifyVideo(transcript) {
  const messages = [
    {
      role: 'system',
      content:
        '你是一位视频内容分类专家。只返回严格的JSON对象，不要添加额外文字。'
    },
    {
      role: 'user',
      content: `请分析以下视频内容，返回严格 JSON：{"category":"分类","tags":["标签1","标签2"],"difficulty":"easy/medium/hard"}。
分类必须在以下范围内选择一个：${ALLOWED_CATEGORIES.join('、')}。
tags 输出 3-5 个核心关键词。
difficulty 反映视频内容的理解难度。
视频内容：${transcript}`
    }
  ];
  const raw = await callDeepSeek(messages, { temperature: 0.2, responseFormat: 'json' });
  const parsed = safeParseJSON(raw, { category: '学术科普', tags: [], difficulty: 'medium' });
  if (!ALLOWED_CATEGORIES.includes(parsed.category)) parsed.category = '学术科普';
  if (!['easy', 'medium', 'hard'].includes(parsed.difficulty)) parsed.difficulty = 'medium';
  if (!Array.isArray(parsed.tags)) parsed.tags = [];
  return parsed;
}

async function generateCharacterResponse(transcript, character, category) {
  const messages = [
    { role: 'system', content: character.systemPrompt },
    {
      role: 'user',
      content: `请基于你的角色性格，重构以下视频内容。
视频分类：${category}
视频原文：${transcript}

请输出严格 JSON，结构如下：
{
  "simpleExplanations": [
    { "term": "术语原文", "explanation": "用你的角色风格写的大白话解释，不超过30字" }
  ],
  "logicTree": {
    "mainArgument": "视频核心观点（一句话）",
    "supportPoints": ["论据1", "论据2", "论据3"],
    "potentialFlaws": ["可能的逻辑漏洞或争议点1", "可能的争议点2"],
    "score": 0到100的逻辑严密度评分
  },
  "actionTips": ["用户可立即执行的行动建议1", "建议2", "建议3"]
}

要求：
- simpleExplanations 提取 3-5 个硬核术语或核心概念
- 每个 explanation 必须体现你的角色性格和说话风格
- actionTips 必须是具体、可执行的小行动，不要空泛口号
- 不要输出 JSON 以外的任何文字`
    }
  ];
  const raw = await callDeepSeek(messages, { temperature: 0.8, responseFormat: 'json', maxTokens: 2500 });
  const parsed = safeParseJSON(raw);
  if (!parsed) return getFallbackResponse(character);

  parsed.simpleExplanations = Array.isArray(parsed.simpleExplanations) ? parsed.simpleExplanations : [];
  parsed.logicTree = parsed.logicTree || {};
  parsed.logicTree.mainArgument = parsed.logicTree.mainArgument || '';
  parsed.logicTree.supportPoints = Array.isArray(parsed.logicTree.supportPoints) ? parsed.logicTree.supportPoints : [];
  parsed.logicTree.potentialFlaws = Array.isArray(parsed.logicTree.potentialFlaws) ? parsed.logicTree.potentialFlaws : [];
  parsed.logicTree.score = typeof parsed.logicTree.score === 'number' ? parsed.logicTree.score : 70;
  parsed.actionTips = Array.isArray(parsed.actionTips) ? parsed.actionTips : [];
  return parsed;
}

async function generateMindmapMermaid(reconstruction, character, category) {
  const { logicTree, simpleExplanations, actionTips } = reconstruction;
  const lines = ['mindmap'];
  const root = (logicTree?.mainArgument || category || '视频核心').replace(/[\n\r]/g, ' ').slice(0, 40);
  lines.push(`  root((${root}))`);

  lines.push(`    ${character.name}视角`);
  (logicTree?.supportPoints || []).slice(0, 5).forEach((p, i) => {
    lines.push(`      论据${i + 1}: ${p.replace(/[\n\r]/g, ' ').slice(0, 30)}`);
  });

  if (simpleExplanations?.length) {
    lines.push('    核心概念');
    simpleExplanations.slice(0, 5).forEach((e) => {
      lines.push(`      ${(e.term || '').slice(0, 20)}`);
    });
  }

  if (logicTree?.potentialFlaws?.length) {
    lines.push('    潜在争议');
    logicTree.potentialFlaws.slice(0, 3).forEach((f, i) => {
      lines.push(`      争议${i + 1}: ${f.replace(/[\n\r]/g, ' ').slice(0, 30)}`);
    });
  }

  if (actionTips?.length) {
    lines.push('    立即行动');
    actionTips.slice(0, 5).forEach((t, i) => {
      lines.push(`      行动${i + 1}: ${t.replace(/[\n\r]/g, ' ').slice(0, 30)}`);
    });
  }

  return lines.join('\n');
}

function getFallbackResponse(character) {
  const fallbackCharacter = character || getCharacterById('scholar-cat');
  return {
    simpleExplanations: [
      {
        term: '内容分析',
        explanation: `${fallbackCharacter.name}暂时无法连接深度分析服务，先记一笔，稍后再聊喵~`
      }
    ],
    logicTree: {
      mainArgument: '视频内容核心论点暂未提取（降级响应）',
      supportPoints: ['服务暂时不可用，已使用降级模式'],
      potentialFlaws: ['本次未进行完整逻辑分析'],
      score: 60
    },
    actionTips: ['稍后重试获取完整解读', '可以先记录你对视频的初步印象'],
    fallback: true
  };
}

module.exports = {
  classifyVideo,
  generateCharacterResponse,
  generateMindmapMermaid,
  getFallbackResponse,
  ALLOWED_CATEGORIES
};
