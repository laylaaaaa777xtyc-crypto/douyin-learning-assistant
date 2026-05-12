<script setup>
// 占位组件 —— 请用你已有的 Character3D 实现替换本文件内容。
// 仅需保留这两个 props：characterId、state（'idle' | 'thinking' | 'speaking'）。
defineProps({
  characterId: { type: String, required: true },
  state: { type: String, default: 'idle' }
})
</script>

<template>
  <div class="relative w-full h-full">
    <slot />
  </div>
</template>
