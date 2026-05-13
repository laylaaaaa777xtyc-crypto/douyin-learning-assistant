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
  return '解说中';
});

const mainExplanation = computed(() => {
  if (props.state.status !== 'success' || !props.state.data) return '';
  const exps = props.state.data.reconstruction.simpleExplanations;
  return exps[0]?.explanation ?? '';
});

// 💡 知识弹幕
const knowledgeBullet = computed(() => {
  if (props.state.status !== 'success' || !props.state.data) return '';
  return props.state.data.reconstruction.logicTree.supportPoints[0] ?? '';
});

// 🔗 联想方向
const associationDir = computed(() => {
  if (props.state.status !== 'success' || !props.state.data) return '';
  return props.state.data.reconstruction.logicTree.mainArgument;
});

// 🌏 延伸思考
const extendedThinking = computed(() => {
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
  <div class="absolute left-3 right-20 bottom-40 z-20 pointer-events-auto">
    <div
      class="relative rounded-2xl p-3.5 backdrop-blur-md"
      :style="{
        background: 'rgba(12, 14, 28, 0.82)',
        border: `1px solid ${character.theme.primary}55`,
        boxShadow: `0 8px 32px ${character.theme.glow}, 0 2px 8px rgba(0,0,0,0.5)`
      }"
    >
      <!-- 解读标题行 -->
      <div class="flex items-center gap-2 mb-2.5">
        <span
          class="inline-flex w-6 h-6 items-center justify-center rounded-full text-sm shrink-0"
          :style="{ background: character.theme.primary }"
        >{{ character.emoji }}</span>
        <span class="text-[13px] font-bold" :style="{ color: character.theme.text }">
          {{ character.name }}
        </span>
        <span class="text-white/40 text-[12px]">{{ statusLabel }}</span>
        <span
          v-if="state.status === 'loading'"
          class="ml-auto inline-block w-1.5 h-1.5 rounded-full animate-pulse"
          :style="{ background: character.theme.primary }"
        />
        <span
          v-else-if="state.status === 'success'"
          class="ml-auto inline-block w-1.5 h-1.5 rounded-full"
          :style="{ background: character.theme.primary }"
        />
      </div>

      <!-- Loading -->
      <div v-if="state.status === 'loading'" class="text-[12px] text-white/70 leading-relaxed italic">
        "{{ character.catchphrase }}"
      </div>

      <!-- Error -->
      <div v-else-if="state.status === 'error'" class="text-[12px] text-white/75 leading-relaxed">
        后端没连上，正在用本地 mock 数据。
      </div>

      <!-- Success -->
      <div v-else class="space-y-2">
        <!-- 主解释引用 -->
        <p v-if="mainExplanation" class="text-[12px] text-white/90 leading-snug italic px-1">
          "{{ mainExplanation }}"
        </p>

        <!-- 💡 知识弹幕 -->
        <div v-if="knowledgeBullet" class="space-y-0.5">
          <div class="flex items-center gap-1 text-[10px] font-semibold tracking-wide" :style="{ color: character.theme.primary }">
            <span>💡</span><span>知识弹幕</span>
          </div>
          <p class="text-[12px] text-white/85 leading-snug pl-1">{{ knowledgeBullet }}</p>
        </div>

        <!-- 🔗 联想方向 -->
        <div v-if="associationDir" class="space-y-0.5">
          <div class="flex items-center gap-1 text-[10px] font-semibold tracking-wide" :style="{ color: character.theme.primary }">
            <span>🔗</span><span>联想方向</span>
          </div>
          <p class="text-[12px] text-white/85 leading-snug pl-1">{{ associationDir }}</p>
        </div>

        <!-- 🌏 延伸思考 -->
        <div v-if="extendedThinking" class="space-y-0.5">
          <div class="flex items-center gap-1 text-[10px] font-semibold tracking-wide" :style="{ color: character.theme.primary }">
            <span>🌏</span><span>延伸思考</span>
          </div>
          <p class="text-[12px] text-white/65 leading-snug pl-1">{{ extendedThinking }}</p>
        </div>

        <!-- video source info -->
        <div v-if="video" class="flex items-center gap-1.5 pt-0.5 flex-wrap">
          <span class="text-[11px] text-white/45 shrink-0">{{ video.author }}</span>
          <span
            v-for="tag in sourceTags"
            :key="tag"
            class="text-[10px] px-1.5 py-0.5 rounded-full"
            :style="{ background: `${character.theme.primary}2a`, color: character.theme.text }"
          >{{ tag }}</span>
        </div>
      </div>

      <!-- 行动按钮 -->
      <div class="flex items-center gap-2 mt-3">
        <button
          @click="emit('open-mindmap')"
          :disabled="!canAct"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-opacity disabled:opacity-40"
          style="background: linear-gradient(90deg, #0fcfb0, #00b4d8); color: #fff;"
        >
          <svg viewBox="0 0 24 24" class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
            <circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
            <path d="M12 7v4M12 11l-5 6M12 11l5 6" />
          </svg>
          生成思维导图
        </button>
        <button
          @click="emit('open-report')"
          :disabled="!canAct"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-opacity disabled:opacity-40"
          style="background: linear-gradient(90deg, #f953c6, #ff6b6b); color: #fff;"
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
