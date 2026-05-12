<script setup lang="ts">
import { computed, ref } from 'vue';
import type { SampleVideo } from '../services/mockData';

const props = defineProps<{ video: SampleVideo }>();
const emit = defineEmits<{ (e: 'swipe-up'): void }>();

const touchStartY = ref<number | null>(null);

function onTouchStart(e: TouchEvent) {
  touchStartY.value = e.touches[0].clientY;
}
function onTouchEnd(e: TouchEvent) {
  if (touchStartY.value === null) return;
  const dy = touchStartY.value - e.changedTouches[0].clientY;
  if (dy > 60) emit('swipe-up');
  touchStartY.value = null;
}
function onWheel(e: WheelEvent) {
  if (e.deltaY > 80) emit('swipe-up');
}

const hashtags = computed(() => {
  const cat = props.video.category;
  return cat.split('/').map((t) => `#${t}`);
});
</script>

<template>
  <div
    class="absolute inset-0 z-0 overflow-hidden cursor-pointer"
    :style="{
      background: `linear-gradient(160deg, ${video.bgGradient[0]} 0%, ${video.bgGradient[1]} 100%)`
    }"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @wheel="onWheel"
  >
    <!-- 背景光斑 -->
    <div
      class="absolute inset-0 opacity-50"
      :style="{
        backgroundImage:
          'radial-gradient(circle at 20% 25%, rgba(255,255,255,0.18) 0, transparent 40%), radial-gradient(circle at 80% 75%, rgba(255,255,255,0.12) 0, transparent 45%)'
      }"
    />
    <!-- 底部渐变,让文字更清晰 -->
    <div class="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

    <!-- 底部作者 + 标题 + 话题 -->
    <div class="absolute left-3 right-24 bottom-16 z-10 text-white space-y-1.5">
      <div class="text-[14px] font-semibold drop-shadow">{{ video.author }}</div>
      <div class="text-[13px] leading-snug drop-shadow line-clamp-2">
        {{ video.title }}
      </div>
      <div class="flex flex-wrap gap-x-2 gap-y-0.5 text-[12px] text-white/85 drop-shadow">
        <span v-for="h in hashtags" :key="h">{{ h }}</span>
      </div>
      <div class="flex items-center gap-1 text-[11px] text-white/70 pt-0.5">
        <svg viewBox="0 0 24 24" class="w-3 h-3 animate-spin" style="animation-duration: 6s" fill="currentColor">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
        <span>原声 · {{ video.category }}</span>
      </div>
    </div>
  </div>
</template>
