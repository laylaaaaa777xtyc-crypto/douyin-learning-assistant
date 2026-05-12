<script setup lang="ts">
import { computed } from 'vue';
import type { CharacterConfig } from '../config/characters.config';
import type { AnalyzeState } from '../composables/useAnalyze';
import type { SampleVideo } from '../services/mockData';

const props = defineProps<{
  character: CharacterConfig;
  state: AnalyzeState;
  video?: SampleVideo;
}>();

const emit = defineEmits<{
  (e: 'open-mindmap'): void;
  (e: 'open-report'): void;
  (e: 'retry'): void;
}>();

const statusLabel = computed(() => {
  if (props.state.status === 'loading') return '解读中';
  if (props.state.status === 'error') return '降级模式';
  return '已解读';
});

const mainExplanation = computed(() => {
  if (props.state.status !== 'success' || !props.state.data) return '';
  const exps = props.state.data.reconstruction.simpleExplanations;
  return exps[0]?.explanation ?? '';
});

const knowledgeBullet = computed(() => {
  if (props.state.status !== 'success' || !props.state.data) return '';
  return props.state.data.reconstruction.logicTree.supportPoints[0] ?? '';
});

const simpleVersion = computed(() => {
  if (props.state.status !== 'success' || !props.state.data) return '';
  return props.state.data.reconstruction.logicTree.mainArgument;
});

const deepQuestion = computed(() => {
  if (props.state.status !== 'success' || !props.state.data) return '';
  return props.state.data.reconstruction.logicTree.potentialFlaws[0] ?? '';
});

const sourceTags = computed(() => {
  if (!props.video) return [];
  return props.video.category.split('/').map((t) => `#${t}`);
});

const canAct = computed(() => props.state.status === 'success');
</script>

<template>
  <div class="absolute left-3 right-24 bottom-36 z-20 pointer-events-auto">
    <div
      class="relative rounded-2xl rounded-tl-sm p-3 backdrop-blur-md"
      :style="{
        background: 'rgba(20, 22, 38, 0.78)',
        border: `1px solid ${character.theme.primary}66`,
        boxShadow: `0 10px 28px ${character.theme.glow}`
      }"
    >
      <!-- 解读标题行 -->
      <div class="flex items-center gap-2 mb-2">
        <span
          class="inline-flex w-6 h-6 items-center justify-center rounded-full text-base shrink-0"
          :style="{ background: character.theme.primary }"
        >
          {{ character.emoji }}
        </span>
        <div class="text-[12px] font-semibold flex items-center gap-1" :style="{ color: character.theme.text }">
          <span>{{ character.name }}</span>
          <span class="text-white/40">·</span>
          <span class="text-white/85">{{ statusLabel }}</span>
        </div>
        <span
          v-if="state.status === 'loading'"
          class="ml-auto inline-block w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse"
        />
      </div>

      <!-- Loading -->
      <div v-if="state.status === 'loading'" class="text-[12px] text-white/70 leading-relaxed">
        {{ character.catchphrase }}
      </div>

      <!-- Error -->
      <div v-else-if="state.status === 'error'" class="text-[12px] text-white/75 leading-relaxed">
        后端没连上，正在用本地 mock 数据。
      </div>

      <!-- Success: info panel layout -->
      <div v-else class="space-y-1.5">
        <!-- explanation text -->
        <p v-if="mainExplanation" class="text-[12px] text-white/85 leading-snug">
          {{ mainExplanation }}
        </p>

        <!-- knowledge bullet (★) -->
        <div v-if="knowledgeBullet" class="flex items-start gap-1.5">
          <span class="shrink-0 mt-[1px] text-[11px]" :style="{ color: character.theme.primary }">★</span>
          <span class="text-[12px] text-white/90 leading-snug">{{ knowledgeBullet }}</span>
        </div>

        <!-- dimensionality reduction (🧠 说人话) -->
        <div v-if="simpleVersion" class="flex items-start gap-1.5">
          <span class="shrink-0 text-[13px] leading-snug">🧠</span>
          <span class="text-[12px] text-white/90 leading-snug">{{ simpleVersion }}</span>
        </div>

        <!-- extended thinking (💡 deeper question) -->
        <div v-if="deepQuestion" class="flex items-start gap-1.5">
          <span class="shrink-0 text-[13px] leading-snug">💡</span>
          <span class="text-[12px] text-white/70 leading-snug">{{ deepQuestion }}</span>
        </div>

        <!-- source info -->
        <div v-if="video" class="flex items-center gap-1.5 pt-0.5 flex-wrap">
          <span class="text-[11px] text-white/50 shrink-0">{{ video.author }}</span>
          <span
            v-for="tag in sourceTags"
            :key="tag"
            class="text-[10px] px-1.5 py-0.5 rounded-full"
            :style="{ background: `${character.theme.primary}33`, color: character.theme.text }"
          >{{ tag }}</span>
        </div>
      </div>

      <!-- 行动按钮 -->
      <div class="flex items-center gap-2 mt-3">
        <button
          @click="emit('open-mindmap')"
          :disabled="!canAct"
          class="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold transition disabled:opacity-40"
          style="background: linear-gradient(90deg, #a07aff, #8d5cff); color: #fff;"
        >
          <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <circle cx="6" cy="12" r="2" />
            <circle cx="18" cy="6" r="2" />
            <circle cx="18" cy="18" r="2" />
            <path d="M8 12h6m-6-1l8-4m-8 5l8 4" />
          </svg>
          生成思维导图
        </button>
        <button
          @click="emit('open-report')"
          :disabled="!canAct"
          class="flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold transition disabled:opacity-40"
          style="background: linear-gradient(90deg, #a07aff, #8d5cff); color: #fff;"
        >
          <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
            <path d="M14 3v5h5M9 13h6M9 17h4" />
          </svg>
          生成今日报告
        </button>
        <button
          v-if="state.status === 'error'"
          @click="emit('retry')"
          class="ml-auto text-[11px] px-2.5 py-1.5 rounded-full bg-white/10 text-white/80 hover:bg-white/20"
        >
          重试
        </button>
      </div>
    </div>
  </div>
</template>
