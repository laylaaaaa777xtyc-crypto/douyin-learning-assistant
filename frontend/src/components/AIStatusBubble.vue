<script setup lang="ts">
import { computed } from 'vue';
import type { CharacterConfig } from '../config/characters.config';
import type { AnalyzeState } from '../composables/useAnalyze';

const props = defineProps<{
  character: CharacterConfig;
  state: AnalyzeState;
}>();

defineEmits<{ (e: 'close'): void }>();

const statusLabel = computed(() => {
  switch (props.state.status) {
    case 'loading':
      return '解读中';
    case 'error':
      return '离线模式';
    default:
      return '已就绪';
  }
});

const greeting = computed(() => {
  return props.character.catchphrase;
});
</script>

<template>
  <div class="absolute top-24 right-3 z-30 max-w-[58%] pointer-events-auto">
    <div
      class="relative rounded-2xl rounded-br-sm px-3.5 py-2.5 backdrop-blur-md text-white shadow-lg"
      :style="{
        background: 'rgba(20, 22, 38, 0.72)',
        border: `1px solid ${character.theme.primary}55`,
        boxShadow: `0 8px 24px ${character.theme.glow}`
      }"
    >
      <div class="flex items-start gap-2">
        <div class="flex-1 min-w-0">
          <div class="text-[12px] font-semibold flex items-center gap-1" :style="{ color: character.theme.text }">
            <span>{{ character.name }}</span>
            <span class="text-white/50">·</span>
            <span class="text-white/80">{{ statusLabel }}</span>
          </div>
          <div class="text-[12px] mt-1 leading-snug text-white/85">
            {{ greeting }}
          </div>
        </div>
        <button
          @click="$emit('close')"
          class="shrink-0 w-5 h-5 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white/80"
        >
          <svg viewBox="0 0 24 24" class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <!-- 气泡小尾巴指向右下 -->
      <div
        class="absolute -bottom-1 right-4 w-2.5 h-2.5 rotate-45"
        :style="{
          background: 'rgba(20, 22, 38, 0.72)',
          borderRight: `1px solid ${character.theme.primary}55`,
          borderBottom: `1px solid ${character.theme.primary}55`
        }"
      />
    </div>
  </div>
</template>
