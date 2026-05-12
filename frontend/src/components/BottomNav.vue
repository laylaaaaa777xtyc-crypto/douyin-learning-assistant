<script setup lang="ts">
import { ref } from 'vue';

type TabId = 'home' | 'friends' | 'msg' | 'me';
const active = ref<TabId>('home');
</script>

<template>
  <div class="absolute bottom-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-md">
    <div class="flex items-center justify-between px-6 py-2.5 text-white/85 text-[13px]">
      <button
        @click="active = 'home'"
        class="flex-1 text-center font-semibold transition"
        :class="active === 'home' ? 'text-white' : 'text-white/55'"
      >
        首页
      </button>
      <button
        @click="active = 'friends'"
        class="flex-1 text-center transition"
        :class="active === 'friends' ? 'text-white' : 'text-white/55'"
      >
        朋友
      </button>

      <!-- 中央发布 -->
      <button class="flex-1 flex items-center justify-center">
        <span class="relative inline-flex w-11 h-7 items-center justify-center">
          <span class="absolute inset-y-0 left-0 w-7 rounded-md bg-cyan-400" />
          <span class="absolute inset-y-0 right-0 w-7 rounded-md bg-rose-500" />
          <span class="relative w-9 h-7 rounded-md bg-white flex items-center justify-center">
            <svg viewBox="0 0 24 24" class="w-4 h-4 text-black" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" fill="none">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </span>
      </button>

      <button
        @click="active = 'msg'"
        class="flex-1 text-center transition relative"
        :class="active === 'msg' ? 'text-white' : 'text-white/55'"
      >
        消息
        <span class="absolute -top-1 right-4 min-w-[16px] h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center px-1">9</span>
      </button>
      <button
        @click="active = 'me'"
        class="flex-1 text-center transition"
        :class="active === 'me' ? 'text-white' : 'text-white/55'"
      >
        我
      </button>
    </div>
    <!-- iOS Home indicator -->
    <div class="flex justify-center pb-1.5">
      <div class="w-28 h-[3px] rounded-full bg-white/80" />
    </div>
  </div>
</template>
