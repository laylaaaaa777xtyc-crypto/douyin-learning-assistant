<script setup lang="ts">
import type { CharacterConfig, CharacterId } from '../config/characters.config';

defineProps<{
  characters: CharacterConfig[];
  activeId: CharacterId;
}>();

defineEmits<{
  (e: 'select', id: CharacterId): void;
}>();
</script>

<template>
  <div class="absolute right-2 top-24 z-30 flex flex-col items-center gap-1">
    <div
      class="flex flex-col items-center gap-2 py-2.5 px-1.5 rounded-2xl backdrop-blur-md"
      style="background: rgba(0,0,0,0.38); border: 1px solid rgba(255,255,255,0.10);"
    >
      <button
        v-for="c in characters"
        :key="c.id"
        @click="$emit('select', c.id)"
        class="relative flex flex-col items-center gap-0.5 transition-all"
        :class="activeId === c.id ? 'scale-110' : 'opacity-60 hover:opacity-90'"
      >
        <!-- avatar circle -->
        <div
          class="w-9 h-9 rounded-full flex items-center justify-center overflow-hidden relative"
          :style="{
            background: activeId === c.id
              ? `radial-gradient(circle, ${c.theme.primary}dd, ${c.theme.primary}66)`
              : 'rgba(255,255,255,0.08)',
            boxShadow: activeId === c.id ? `0 0 16px ${c.theme.glow}, 0 0 6px ${c.theme.glow}` : 'none',
            border: activeId === c.id
              ? `2px solid ${c.theme.primary}`
              : '1.5px solid rgba(255,255,255,0.18)'
          }"
        >
          <!-- video thumbnail for characters that have webm -->
          <video
            v-if="c.videoSrc"
            :src="c.videoSrc"
            class="w-full h-full object-cover"
            autoplay
            loop
            muted
            playsinline
          />
          <!-- emoji fallback -->
          <span v-else class="text-[18px] leading-none select-none">{{ c.emoji }}</span>

          <!-- active pulse ring -->
          <div
            v-if="activeId === c.id"
            class="absolute inset-0 rounded-full animate-ping opacity-25"
            :style="{ background: c.theme.primary }"
          />
        </div>
        <!-- character name label -->
        <span
          class="text-[9px] font-medium leading-none tracking-wide"
          :style="{ color: activeId === c.id ? c.theme.text : 'rgba(255,255,255,0.55)' }"
        >{{ c.name }}</span>
      </button>
    </div>

    <!-- footer label -->
    <div class="mt-1 text-[9px] text-white/60 font-medium tracking-widest drop-shadow text-center leading-tight">
      切换<br>AI伴侣
    </div>
  </div>
</template>
