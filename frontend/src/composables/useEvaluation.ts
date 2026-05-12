import { computed, type Ref } from 'vue';
import type { AnalyzeResponse, EvaluationScores } from '../types/api';

/**
 * 三个评价指标全部从后端的真实分析结果派生 —— 思维树（logicTree）就是评估的核心数据源。
 * - 逻辑严密度: 直接取 logicTree.score（DeepSeek 评分）
 * - 知识效用值: 用户能直接拿走的"可执行密度" = 概念数 + 行动数加权
 * - 伦理安全度: 反向衡量潜在争议数量
 */
export function useEvaluation(payload: Ref<AnalyzeResponse | null>) {
  const scores = computed<EvaluationScores>(() => {
    const r = payload.value?.reconstruction;
    if (!r) return { logicRigor: 0, knowledgeUtility: 0, ethicalSafety: 0 };

    const logicRigor = clamp(Math.round(r.logicTree.score ?? 70), 0, 100);

    const explanations = r.simpleExplanations?.length ?? 0;
    const actions = r.actionTips?.length ?? 0;
    const knowledgeUtility = clamp(70 + 5 * (explanations + actions), 0, 100);

    const flaws = r.logicTree.potentialFlaws?.length ?? 0;
    const ethicalSafety = clamp(100 - 8 * flaws, 60, 100);

    return { logicRigor, knowledgeUtility, ethicalSafety };
  });

  return { scores };
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
