import type { AnalyzeRequest, AnalyzeResponse } from '../types/api';
import type { CharacterId } from '../config/characters.config';
import { getCharacter } from '../config/characters.config';

export interface SampleVideo {
  videoId: string;
  title: string;
  author: string;
  category: string;
  transcript: string;
  likes: string;
  comments: string;
  favorites?: string;
  shares: string;
  bgGradient: [string, string];
}

export const SAMPLE_VIDEOS: SampleVideo[] = [
  {
    videoId: 'sample-rocket',
    title: '#第27次发射圆满成功！液氧甲烷发动机揭秘',
    author: '@航天小知识',
    category: '航天科技',
    transcript:
      '液氧甲烷发动机是新一代运载火箭的核心动力系统。液氧是超低温液态氧气，甲烷就是天然气主成分。两者混合点燃产生高压燃气，向下喷射推动火箭升空。相比传统煤油发动机，甲烷更清洁、无积碳、还能利用火星大气就地制备，是深空探测的理想燃料。',
    likes: '12.8w',
    comments: '2.3w',
    favorites: '8.6w',
    shares: '3.2w',
    bgGradient: ['#0B0F1A', '#0d1a2e']
  },
  {
    videoId: 'sample-transformer',
    title: '#Transformer 是怎么工作的',
    author: '@AI 解谜局',
    category: 'AI/数据科学',
    transcript:
      'Transformer 的核心是 self-attention：每个 token 都会去看序列里所有其他 token，计算相关度权重再加权求和。相比 RNN 它能并行训练，相比 CNN 感受野是全局的。GPT、BERT 都建立在它之上。',
    likes: '128.5w',
    comments: '3.2w',
    shares: '8.7w',
    bgGradient: ['#1a1b3a', '#0d1a40']
  },
  {
    videoId: 'sample-anti-burnout',
    title: '#为什么我们总在精神内耗',
    author: '@心理树洞',
    category: '心理健康',
    transcript:
      '不是事件本身让我们痛苦，而是我们对事件的解释。认知行为疗法说，识别自动化负面思维，挑战它，再用更平衡的视角重新解读，就能把内耗的能量收回来。',
    likes: '89.3w',
    comments: '5.6w',
    shares: '12w',
    bgGradient: ['#3a1f4a', '#1a0d2e']
  },
  {
    videoId: 'sample-discipline',
    title: '#21天养成习惯是骗你的',
    author: '@勇者训练营',
    category: '学习动力',
    transcript:
      '21 天养成习惯这个说法是营销编出来的。真实研究显示，习惯固化平均需要 66 天，区间从 18 天到 254 天都有。关键不是天数，是「不破不立」——一次中断不致命，重新开始就是胜利。',
    likes: '52.1w',
    comments: '1.8w',
    shares: '4.3w',
    bgGradient: ['#3a2516', '#1f1208']
  }
];

const MOCK_BY_VIDEO: Record<string, Omit<AnalyzeResponse['reconstruction'], never>> = {
  'sample-rocket': {
    simpleExplanations: [
      { term: '液氧甲烷发动机', explanation: '"冰箱里的氧气"和"天然气"一起烧，超高温超高压推动火箭，这就是它的本质。' },
      { term: '液氧', explanation: '超低温液态氧，助燃剂，让甲烷燃烧更完全。' },
      { term: '甲烷', explanation: '天然气主成分，高效清洁，未来可在火星就地制备。' }
    ],
    logicTree: {
      mainArgument: '说人话：就是"超级加强版打火机" 🚀',
      supportPoints: [
        '燃料 = 液氧 + 甲烷 → 点燃 → 推着火箭飞！',
        '甲烷燃烧副产品少，发动机可重复使用',
        '火星大气可电解制备甲烷，支持深空探索'
      ],
      potentialFlaws: [
        '为什么不用汽油？来看看原理对比 👀',
        '液氧储存需要超低温设备，技术要求极高'
      ],
      score: 90
    },
    actionTips: [
      '搜索"朱雀二号"看看国内首款液氧甲烷火箭',
      '对比SpaceX猛禽与传统煤油发动机的比冲数据',
      '想象在火星上用当地资源给飞船加油！'
    ]
  },
  'sample-transformer': {
    simpleExplanations: [
      { term: 'Self-Attention', explanation: '每个词去问其他所有词："你跟我有多大关系？"再按权重汇总信息喵。' },
      { term: 'Token', explanation: '把句子切成一小块一小块，每块叫一个 token，是模型看见的最小单位。' },
      { term: '并行训练', explanation: '不像 RNN 要一个个等，Transformer 可以同时算所有位置，GPU 跑得飞快。' },
      { term: '感受野', explanation: '模型能"看到"的范围。Transformer 看的是整篇上下文，CNN 只看附近一小块。' }
    ],
    logicTree: {
      mainArgument: 'Transformer 通过 self-attention 实现全局感受野和并行训练，是大模型的基石。',
      supportPoints: [
        '注意力机制让任意两个 token 直接交互',
        '矩阵运算天然适合 GPU 并行',
        'GPT / BERT / T5 都在它之上建立'
      ],
      potentialFlaws: [
        '未提及 O(n²) 的复杂度瓶颈',
        '未讨论长上下文场景下的性能衰减'
      ],
      score: 84
    },
    actionTips: [
      '看一遍 The Illustrated Transformer 这篇博客',
      '用 PyTorch 手写一遍 MultiHeadAttention，跑通一个最小例子',
      '对比 RNN 和 Transformer 在同一任务上的训练速度'
    ]
  },
  'sample-anti-burnout': {
    simpleExplanations: [
      { term: '认知行为疗法', explanation: '换个角度想，就能少痛一点。没关系的，慢慢练就好。' },
      { term: '自动化负面思维', explanation: '脑袋里没经过审核就冒出来的小黑话，比如"我肯定不行"。' },
      { term: '精神内耗', explanation: '能量都花在自己跟自己打架上，事情还没开始就累了。' }
    ],
    logicTree: {
      mainArgument: '内耗的源头不是事件，而是对事件的解释，可以通过认知重构调整。',
      supportPoints: [
        '同样的事件不同人反应差异极大，说明解释是中介',
        '认知行为疗法在临床上有大量循证支持',
        '识别→挑战→重构是可训练的三步'
      ],
      potentialFlaws: [
        '严重抑郁或创伤不是单靠"换想法"能解决的',
        '过度自我审视本身也是内耗的一种'
      ],
      score: 78
    },
    actionTips: [
      '今晚写下三句让你不舒服的"自动话"',
      '挑一句，问自己："有没有别的解释方式？"',
      '不必要求一次解决，能慢半拍就够了'
    ]
  },
  'sample-discipline': {
    simpleExplanations: [
      { term: '习惯固化', explanation: '动作不用想就自动做了——这才叫养成！平均 66 天，伙伴！' },
      { term: '不破不立', explanation: '断一次不算失败！重新开始才是真正的胜利！' },
      { term: '21天迷思', explanation: '老梗了，是营销文案造出来的，不是科学结论！别信！' }
    ],
    logicTree: {
      mainArgument: '习惯养成靠的不是天数倒数，而是中断后能不能重启。',
      supportPoints: [
        '研究表明习惯固化区间为 18-254 天',
        '"21 天"来源是营销话术不是实验数据',
        '中断后恢复能力比连续坚持更预测长期结果'
      ],
      potentialFlaws: [
        '没区分简单习惯（喝水）和复杂习惯（每天健身）',
        '个体差异和动机水平差异没被讨论'
      ],
      score: 81
    },
    actionTips: [
      '今天就选一件超小的事开始，比如做 2 个俯卧撑',
      '准备好"断了怎么办"的预案，断了就重启不复盘',
      '记录的不是连续天数，而是这周完成了几次'
    ]
  }
};

export function buildMockAnalyzeResponse(req: AnalyzeRequest): AnalyzeResponse {
  const characterId = (req.characterId as CharacterId) || 'scholar-cat';
  const character = getCharacter(characterId);
  const sample = SAMPLE_VIDEOS.find((v) => v.videoId === req.videoId) ?? SAMPLE_VIDEOS[0];
  const reconstruction = MOCK_BY_VIDEO[sample.videoId] ?? MOCK_BY_VIDEO['sample-transformer'];

  return {
    videoId: req.videoId,
    classification: {
      category: sample.category,
      tags: sample.category.split('/'),
      difficulty: 'medium'
    },
    character: {
      id: character.id,
      name: character.name,
      avatarHint: ''
    },
    reconstruction,
    mindmapMermaid: buildMermaid(reconstruction, character.name, sample.category),
    cached: false,
    fallback: true
  };
}

function buildMermaid(
  r: AnalyzeResponse['reconstruction'],
  characterName: string,
  category: string
): string {
  const root = (r.logicTree.mainArgument || category).replace(/[\n\r"]/g, ' ').slice(0, 36);
  const lines: string[] = ['mindmap', `  root((${root}))`];

  lines.push(`    ${characterName}视角`);
  r.logicTree.supportPoints.slice(0, 5).forEach((p, i) => {
    lines.push(`      论据${i + 1}: ${p.replace(/[\n\r"]/g, ' ').slice(0, 28)}`);
  });

  if (r.simpleExplanations.length) {
    lines.push('    核心概念');
    r.simpleExplanations.slice(0, 5).forEach((e) => {
      lines.push(`      ${(e.term || '').slice(0, 18)}`);
    });
  }

  if (r.logicTree.potentialFlaws.length) {
    lines.push('    潜在争议');
    r.logicTree.potentialFlaws.slice(0, 3).forEach((f, i) => {
      lines.push(`      争议${i + 1}: ${f.replace(/[\n\r"]/g, ' ').slice(0, 28)}`);
    });
  }

  if (r.actionTips.length) {
    lines.push('    立即行动');
    r.actionTips.slice(0, 5).forEach((t, i) => {
      lines.push(`      行动${i + 1}: ${t.replace(/[\n\r"]/g, ' ').slice(0, 28)}`);
    });
  }

  return lines.join('\n');
}
