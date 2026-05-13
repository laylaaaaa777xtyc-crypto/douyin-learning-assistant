<script setup lang="ts">
import { ref } from 'vue';

type TabId = '关注' | '推荐' | '成都';
const active = ref<TabId>('推荐');
const hasFollowNotif = ref(true);

const emit = defineEmits<{ (e: 'go-live'): void }>();
</script>

<template>
  <div class="absolute top-0 left-0 right-0 z-30 pointer-events-none">
    <!-- 状态条 -->
    <div class="flex items-center justify-between px-5 pt-2 text-white text-[12px] font-semibold">
      <span>17:15</span>
      <div class="flex items-center gap-1">
        <svg viewBox="0 0 18 12" class="w-4 h-3" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="5" y="5" width="3" height="7" rx="0.5" />
          <rect x="10" y="2" width="3" height="10" rx="0.5" />
          <rect x="15" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg viewBox="0 0 16 12" class="w-4 h-3" fill="currentColor">
          <path d="M8 2c2.7 0 5.2 1 7 2.7l-1.4 1.5A7.8 7.8 0 0 0 8 4 7.8 7.8 0 0 0 2.4 6.2L1 4.7A10 10 0 0 1 8 2zm0 4c1.7 0 3.2.6 4.3 1.7l-1.4 1.5A4 4 0 0 0 8 8a4 4 0 0 0-2.9 1.2L3.7 7.7A5.9 5.9 0 0 1 8 6zm0 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
        </svg>
        <div class="flex items-center">
          <div class="w-5 h-2.5 rounded-[3px] border border-white/90 relative">
            <div class="absolute inset-0.5 bg-white rounded-[1.5px]" style="width: 80%" />
          </div>
          <div class="w-0.5 h-1 bg-white/90 rounded-r-sm" />
        </div>
      </div>
    </div>

    <!-- 导航行 -->
    <div class="flex items-center justify-between px-4 mt-2 pointer-events-auto">
      <!-- 直播按钮 (左) -->
      <button class="flex items-center gap-1 text-white/90 hover:text-white" @click="emit('go-live')">
        <span
          class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest"
          style="background: linear-gradient(135deg, #ff4f4f, #ff2d55); color: #fff; letter-spacing: 0.05em;"
        >
          <svg viewBox="0 0 10 10" class="w-2 h-2" fill="currentColor">
            <circle cx="5" cy="5" r="4" />
          </svg>
          LIVE
        </span>
      </button>

      <!-- 中央 Tabs -->
      <div class="flex items-center gap-5 text-white/60 text-[15px] font-medium">
        <button
          v-for="t in (['关注', '推荐', '成都'] as const)"
          :key="t"
          @click="active = t"
          class="relative pb-1.5 transition-colors"
          :class="active === t ? 'text-white text-[17px] font-bold' : 'hover:text-white/80'"
        >
          {{ t }}
          <!-- 通知红点 (关注) -->
          <span
            v-if="t === '关注' && hasFollowNotif"
            class="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-rose-500"
          />
          <!-- 激活下划线 -->
          <span
            v-if="active === t"
            class="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-[3px] rounded-full bg-white"
          />
        </button>
      </div>

      <!-- 搜索 (右) -->
      <button class="text-white/90 hover:text-white">
        <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </button>
    </div>
  </div>
</template>
