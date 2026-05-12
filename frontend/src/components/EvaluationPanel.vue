<script setup lang="ts">
import { computed } from 'vue';
import type { EvaluationScores } from '../types/api';
import type { CharacterConfig } from '../config/characters.config';

const props = defineProps<{
  scores: EvaluationScores;
  character: CharacterConfig;
}>();

interface MetricRow {
  key: keyof EvaluationScores;
  label: string;
  hint: string;
  color: string;
  value: number;
}

const rows = computed<MetricRow[]>(() => [
  {
    key: 'logicRigor',
    label: '逻辑严密度',
    hint: '思维树论据与漏洞推断得分',
    color: '#7BC9FF',
    value: props.scores.logicRigor
  },
  {
    key: 'knowledgeUtility',
    label: '知识效用值',
    hint: '可拆解概念 + 可执行行动',
    color: '#6BE5A8',
    value: props.scores.knowledgeUtility
  },
  {
    key: 'ethicalSafety',
    label: '伦理安全度',
    hint: '内容争议与潜在风险审计',
    color: '#FFB270',
    value: props.scores.ethicalSafety
  }
]);
</script>

<template>
  <div class="rounded-xl border border-white/10 p-4 bg-black/40">
    <div class="flex items-center justify-between mb-3">
      <div class="text-sm font-semibold" :style="{ color: character.theme.text }">
        内容全评价看板
      </div>
      <div class="text-[10px] text-white/40 tracking-wider">
        基于 {{ character.name }} 视角的思维树推断
      </div>
    </div>
    <div class="grid grid-cols-3 gap-3">
      <div
        v-for="row in rows"
        :key="row.key"
        class="rounded-lg p-3 bg-white/5 border border-white/10"
      >
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-bold" :style="{ color: row.color }">{{ row.value }}</span>
          <span class="text-xs text-white/50">%</span>
        </div>
        <div class="text-xs text-white/80 mt-1">{{ row.label }}</div>
        <div class="text-[10px] text-white/40 mt-1 leading-snug">{{ row.hint }}</div>
        <div class="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-700"
            :style="{ width: `${row.value}%`, background: row.color }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
