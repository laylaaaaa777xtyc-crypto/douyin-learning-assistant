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
  <div class="absolute right-2 top-44 z-30 flex flex-col items-center">
    <div class="flex flex-col items-center gap-2.5 py-2.5 px-1.5 rounded-2xl bg-black/35 backdrop-blur-md border border-white/10">
      <button
        v-for="c in characters"
        :key="c.id"
        @click="$emit('select', c.id)"
        class="relative w-9 h-9 rounded-full flex items-center justify-center text-base transition-all"
        :class="activeId === c.id ? 'scale-110' : 'opacity-65 hover:opacity-100'"
        :style="{
          background: activeId === c.id
            ? `linear-gradient(135deg, ${c.theme.primary}, ${c.theme.primary}99)`
            : 'rgba(255,255,255,0.08)',
          boxShadow: activeId === c.id ? `0 0 14px ${c.theme.glow}` : 'none',
          border: activeId === c.id
            ? `2px solid ${c.theme.primary}`
            : '1px solid rgba(255,255,255,0.18)'
        }"
      >
        <span>{{ c.emoji }}</span>
      </button>
    </div>
    <div class="mt-1.5 text-[10px] text-white/75 font-medium tracking-wider drop-shadow">
      切换AI伴侣
    </div>
  </div>
</template>
