<script setup lang="ts">
import { computed, onMounted, ref, toRef, watch } from 'vue';
import mermaid from 'mermaid';
import { toPng } from 'html-to-image';
import type { AnalyzeResponse } from '../types/api';
import type { CharacterConfig } from '../config/characters.config';
import { useEvaluation } from '../composables/useEvaluation';
import EvaluationPanel from './EvaluationPanel.vue';

const props = defineProps<{
  data: AnalyzeResponse;
  character: CharacterConfig;
}>();

const emit = defineEmits<{ (e: 'close'): void }>();

const dataRef = toRef(props, 'data');
const reconstruction = computed(() => dataRef.value.reconstruction);
const payloadRef = computed<AnalyzeResponse | null>(() => dataRef.value);
const { scores } = useEvaluation(payloadRef as any);

const cardRef = ref<HTMLDivElement | null>(null);
const mermaidRef = ref<HTMLDivElement | null>(null);
const exporting = ref(false);
const exportError = ref<string | null>(null);

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'loose',
  themeVariables: {
    fontFamily: 'PingFang SC, Microsoft YaHei, system-ui, sans-serif',
    primaryColor: props.character.theme.primary,
    primaryTextColor: '#ffffff',
    lineColor: props.character.theme.primary
  }
});

async function render() {
  if (!mermaidRef.value) return;
  const source = props.data.mindmapMermaid || 'mindmap\n  root((暂无内容))';
  try {
    const { svg } = await mermaid.render(`mm-${Date.now()}`, source);
    mermaidRef.value.innerHTML = svg;
  } catch (err) {
    mermaidRef.value.innerHTML = `<pre class="text-xs text-rose-300 whitespace-pre-wrap p-4">${(err as Error).message}\n\n${source}</pre>`;
  }
}

onMounted(render);
watch(() => props.data.videoId + props.character.id, render);

async function exportInsightCard() {
  if (!cardRef.value || exporting.value) return;
  exporting.value = true;
  exportError.value = null;
  try {
    const dataUrl = await toPng(cardRef.value, {
      pixelRatio: 2,
      backgroundColor: '#0b0b10',
      cacheBust: true
    });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `伴灵译者-${props.character.name}-${props.data.videoId}.png`;
    a.click();
  } catch (err) {
    exportError.value = (err as Error).message || '导出失败';
  } finally {
    exporting.value = false;
  }
}
</script>

<template>
  <div class="absolute inset-0 z-50 bg-black/85 backdrop-blur-md overflow-y-auto">
    <div class="min-h-full p-4 pb-12">
      <div class="flex items-center justify-between mb-4">
        <div>
          <div class="text-[11px] text-white/40 tracking-widest">情报重构 · INSIGHT</div>
          <div class="text-base font-semibold" :style="{ color: character.theme.text }">
            {{ character.name }}视角 · {{ data.classification.category }}
          </div>
        </div>
        <button
          @click="emit('close')"
          class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          aria-label="关闭"
        >
          ✕
        </button>
      </div>

      <div ref="cardRef" class="space-y-3 p-3 rounded-2xl bg-gradient-to-b from-[#13131a] to-[#0a0a10] border border-white/5">
        <div class="rounded-xl p-3 bg-white/5 border border-white/10">
          <div class="text-[10px] tracking-widest text-white/40">核心论点</div>
          <div class="text-sm mt-1 leading-relaxed" :style="{ color: character.theme.text }">
            {{ reconstruction.logicTree.mainArgument || '—' }}
          </div>
        </div>

        <div class="rounded-xl border border-white/10 bg-black/40 p-2">
          <div class="text-[10px] tracking-widest text-white/40 px-1 pb-1">思维导图</div>
          <div ref="mermaidRef" class="mermaid-wrap overflow-auto flex justify-center" />
        </div>

        <EvaluationPanel :scores="scores" :character="character" />

        <div class="grid grid-cols-1 gap-2">
          <div class="rounded-xl p-3 bg-white/5 border border-white/10">
            <div class="text-[10px] tracking-widest text-emerald-300/80 mb-1.5">支持论据</div>
            <ul class="space-y-1 text-xs text-white/85">
              <li v-for="(p, i) in reconstruction.logicTree.supportPoints" :key="`s-${i}`" class="flex gap-2">
                <span class="text-emerald-300">✓</span><span>{{ p }}</span>
              </li>
              <li v-if="!reconstruction.logicTree.supportPoints.length" class="text-white/30">—</li>
            </ul>
          </div>

          <div class="rounded-xl p-3 bg-white/5 border border-white/10">
            <div class="text-[10px] tracking-widest text-amber-300/80 mb-1.5">潜在争议</div>
            <ul class="space-y-1 text-xs text-white/85">
              <li v-for="(f, i) in reconstruction.logicTree.potentialFlaws" :key="`f-${i}`" class="flex gap-2">
                <span class="text-amber-300">⚠</span><span>{{ f }}</span>
              </li>
              <li v-if="!reconstruction.logicTree.potentialFlaws.length" class="text-white/30">—</li>
            </ul>
          </div>

          <div class="rounded-xl p-3 bg-white/5 border border-white/10">
            <div class="text-[10px] tracking-widest text-pink-300/80 mb-1.5">立即行动</div>
            <ul class="space-y-1 text-xs text-white/85">
              <li v-for="(t, i) in reconstruction.actionTips" :key="`t-${i}`" class="flex gap-2">
                <span class="text-pink-300">→</span><span>{{ t }}</span>
              </li>
              <li v-if="!reconstruction.actionTips.length" class="text-white/30">—</li>
            </ul>
          </div>
        </div>

        <div class="pt-2 text-center text-[10px] text-white/30 tracking-widest">
          伴灵·译者 · BANLING TRANSLATOR
        </div>
      </div>

      <div class="mt-4 flex items-center gap-3">
        <button
          @click="exportInsightCard"
          :disabled="exporting"
          class="flex-1 py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50"
          :style="{ background: character.theme.primary, color: '#1a1a1a' }"
        >
          {{ exporting ? '正在生成长图...' : '导出情报卡（PNG）' }}
        </button>
        <button
          @click="emit('close')"
          class="px-5 py-3 rounded-xl text-sm bg-white/10 text-white/80 hover:bg-white/20"
        >
          关闭
        </button>
      </div>
      <div v-if="exportError" class="mt-2 text-xs text-rose-300">{{ exportError }}</div>
    </div>
  </div>
</template>

<style scoped>
.mermaid-wrap :deep(svg) {
  max-width: 100%;
  height: auto;
}
</style>
