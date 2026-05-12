<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  likes: string;
  comments: string;
  shares: string;
  favorites?: string;
}>();

const liked = ref(false);
const favorited = ref(false);
</script>

<template>
  <div class="absolute right-2.5 bottom-44 z-20 flex flex-col items-center gap-4 text-white">
    <button
      @click="liked = !liked"
      class="flex flex-col items-center group"
      :class="liked ? 'text-rose-500' : ''"
    >
      <svg viewBox="0 0 24 24" class="w-8 h-8 drop-shadow" fill="currentColor">
        <path
          d="M12 21s-7-4.35-9.5-8.5C.93 10.06 2.42 6 6 6c2 0 3.5 1.2 4 2 .5-.8 2-2 4-2 3.58 0 5.07 4.06 3.5 6.5C19 16.65 12 21 12 21z"
        />
      </svg>
      <span class="text-[11px] mt-0.5 font-medium drop-shadow">{{ likes }}</span>
    </button>

    <button class="flex flex-col items-center group">
      <svg viewBox="0 0 24 24" class="w-8 h-8 drop-shadow" fill="currentColor">
        <path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-7l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      </svg>
      <span class="text-[11px] mt-0.5 font-medium drop-shadow">{{ comments }}</span>
    </button>

    <button
      @click="favorited = !favorited"
      class="flex flex-col items-center group"
      :class="favorited ? 'text-amber-400' : ''"
    >
      <svg viewBox="0 0 24 24" class="w-8 h-8 drop-shadow" fill="currentColor">
        <path d="M12 2l3 6.9 7.6.7-5.7 5 1.7 7.4L12 18l-6.6 4 1.7-7.4-5.7-5L9 8.9z" />
      </svg>
      <span class="text-[11px] mt-0.5 font-medium drop-shadow">{{ favorites ?? '收藏' }}</span>
    </button>

    <button class="flex flex-col items-center group">
      <svg viewBox="0 0 24 24" class="w-8 h-8 drop-shadow" fill="currentColor">
        <path d="M14 3v2.3A8 8 0 1 1 5.6 14l-2-.4A10 10 0 1 0 14 3.4z" />
        <path d="M14 0l6 5-6 5z" />
      </svg>
      <span class="text-[11px] mt-0.5 font-medium drop-shadow">{{ shares }}</span>
    </button>
  </div>
</template>
