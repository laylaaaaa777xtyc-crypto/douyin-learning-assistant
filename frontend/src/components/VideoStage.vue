<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { SampleVideo } from '../services/mockData';
import { useCamera } from '../composables/useCamera';

const props = defineProps<{
  video: SampleVideo;
  cameraActive?: boolean;
}>();
const emit = defineEmits<{
  (e: 'swipe-up'): void;
  (e: 'camera-close'): void;
}>();

const touchStartY = ref<number | null>(null);
function onTouchStart(e: TouchEvent) { touchStartY.value = e.touches[0].clientY; }
function onTouchEnd(e: TouchEvent) {
  if (touchStartY.value === null) return;
  if (touchStartY.value - e.changedTouches[0].clientY > 60) emit('swipe-up');
  touchStartY.value = null;
}
function onWheel(e: WheelEvent) { if (e.deltaY > 80) emit('swipe-up'); }

const hashtags = computed(() => props.video.category.split('/').map((t) => `#${t}`));

const cameraEl = ref<HTMLVideoElement | null>(null);
const { status: camStatus, error: camError, start: camStart, stop: camStop } = useCamera();

watch(
  () => props.cameraActive,
  async (active) => {
    if (!cameraEl.value) return;
    if (active) await camStart(cameraEl.value);
    else camStop(cameraEl.value);
  }
);

// star positions generated once per component mount (deterministic by index)
const stars = Array.from({ length: 80 }, (_, i) => ({
  x: ((i * 137.5) % 100).toFixed(2),
  y: ((i * 97.3) % 100).toFixed(2),
  r: (0.8 + (i % 5) * 0.35).toFixed(2),
  dur: (2.5 + (i % 7) * 0.6).toFixed(1),
  delay: (-(i % 5) * 0.8).toFixed(1)
}));

const dataNodes = Array.from({ length: 12 }, (_, i) => ({
  x: ((i * 53 + 10) % 80 + 10).toFixed(0),
  y: ((i * 71 + 5) % 80 + 5).toFixed(0),
  delay: (i * 0.3).toFixed(1)
}));

const particles = Array.from({ length: 24 }, (_, i) => ({
  x: ((i * 97) % 100).toFixed(1),
  dur: (3 + (i % 5)).toFixed(1),
  delay: (-(i % 6) * 0.7).toFixed(1),
  size: (3 + (i % 4) * 2)
}));
</script>

<template>
  <div
    class="absolute inset-0 z-0 overflow-hidden cursor-pointer"
    :style="{ background: `linear-gradient(160deg, ${video.bgGradient[0]} 0%, ${video.bgGradient[1]} 100%)` }"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @wheel="onWheel"
  >
    <!-- ─── Scene: 火箭/航天 (sample-rocket) ─────────────────────────── -->
    <template v-if="video.videoId === 'sample-rocket' && camStatus !== 'active'">
      <!-- star field -->
      <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <circle
          v-for="(s, i) in stars"
          :key="i"
          :cx="`${s.x}%`"
          :cy="`${s.y}%`"
          :r="s.r"
          fill="white"
          :opacity="0.3 + (i % 5) * 0.14"
        >
          <animate attributeName="opacity" :values="`${0.3 + (i%5)*0.14};1;${0.3 + (i%5)*0.14}`"
            :dur="`${s.dur}s`" :begin="`${s.delay}s`" repeatCount="indefinite" />
        </circle>
      </svg>
      <!-- rocket silhouette rising from center-bottom -->
      <div class="absolute bottom-[28%] left-1/2 -translate-x-1/2 rocket-rise pointer-events-none select-none">
        <svg width="56" height="140" viewBox="0 0 56 140" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 0 18px #4fc3f7aa);">
          <!-- body -->
          <ellipse cx="28" cy="80" rx="12" ry="46" fill="#b0c4de" fill-opacity="0.85"/>
          <!-- nose -->
          <path d="M28 10 Q40 50 28 68 Q16 50 28 10Z" fill="#dce8f5" fill-opacity="0.9"/>
          <!-- fins -->
          <path d="M16 118 L4 138 L16 128Z" fill="#90a4ae" fill-opacity="0.8"/>
          <path d="M40 118 L52 138 L40 128Z" fill="#90a4ae" fill-opacity="0.8"/>
          <!-- windows -->
          <circle cx="28" cy="72" r="5" fill="#4fc3f7" fill-opacity="0.7"/>
          <!-- exhaust -->
          <ellipse cx="28" cy="130" rx="8" ry="12" fill="#ff7043" fill-opacity="0.5">
            <animate attributeName="ry" values="10;16;10" dur="0.4s" repeatCount="indefinite"/>
            <animate attributeName="fill-opacity" values="0.5;0.85;0.5" dur="0.4s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="28" cy="136" rx="5" ry="8" fill="#ffcc02" fill-opacity="0.7">
            <animate attributeName="ry" values="6;12;6" dur="0.35s" repeatCount="indefinite"/>
          </ellipse>
        </svg>
      </div>
      <!-- planet / earth glow at bottom -->
      <div
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200%] h-48 rounded-full"
        style="background: radial-gradient(ellipse at 50% 100%, #1a3a5c 0%, #0d1f35 40%, transparent 70%); transform: translateX(-50%);"
      />
      <!-- atmospheric glow -->
      <div
        class="absolute bottom-32 left-0 right-0 h-24"
        style="background: linear-gradient(to top, rgba(79,195,247,0.08), transparent);"
      />
    </template>

    <!-- ─── Scene: AI / Transformer (sample-transformer) ────────────── -->
    <template v-else-if="video.videoId === 'sample-transformer' && camStatus !== 'active'">
      <svg class="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
        <!-- connection lines between nodes -->
        <line v-for="(n, i) in dataNodes.slice(0, 8)" :key="`l${i}`"
          :x1="`${n.x}%`" :y1="`${n.y}%`"
          :x2="`${dataNodes[(i+3)%12].x}%`" :y2="`${dataNodes[(i+3)%12].y}%`"
          stroke="#4d9de0" stroke-width="0.8" stroke-opacity="0.4"/>
        <!-- data nodes -->
        <circle v-for="(n, i) in dataNodes" :key="`n${i}`"
          :cx="`${n.x}%`" :cy="`${n.y}%`" r="4" fill="#4d9de0" fill-opacity="0.6">
          <animate attributeName="r" values="3;6;3" :dur="`${2 + i*0.2}s`" :begin="`${n.delay}s`" repeatCount="indefinite"/>
          <animate attributeName="fill-opacity" values="0.4;1;0.4" :dur="`${2 + i*0.2}s`" :begin="`${n.delay}s`" repeatCount="indefinite"/>
        </circle>
      </svg>
      <!-- floating code text -->
      <div class="absolute inset-0 overflow-hidden opacity-20 font-mono text-[10px] text-blue-300 leading-5 pointer-events-none select-none p-4">
        <div class="code-scroll">
          <div v-for="row in 40" :key="row">{{ Array.from({length: 6}, () => Math.random() > 0.5 ? '1' : '0').join(' ') }}</div>
        </div>
      </div>
      <!-- center glow -->
      <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 50%, rgba(77,157,224,0.12) 0%, transparent 70%);"/>
    </template>

    <!-- ─── Scene: 心理健康 (sample-anti-burnout) ────────────────────── -->
    <template v-else-if="video.videoId === 'sample-anti-burnout' && camStatus !== 'active'">
      <!-- floating orbs / particles -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          v-for="(p, i) in particles"
          :key="i"
          class="absolute rounded-full particle-float"
          :style="{
            left: `${p.x}%`,
            bottom: '-20px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `hsl(${280 + (i%6)*15}, 70%, 75%)`,
            opacity: 0.3 + (i % 4) * 0.12,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`
          }"
        />
      </div>
      <!-- soft radial glow -->
      <div class="absolute inset-0" style="background: radial-gradient(ellipse at 40% 60%, rgba(244,164,182,0.18) 0%, rgba(120,60,180,0.10) 50%, transparent 75%);"/>
    </template>

    <!-- ─── Scene: 学习动力 (sample-discipline) ──────────────────────── -->
    <template v-else-if="video.videoId === 'sample-discipline' && camStatus !== 'active'">
      <!-- sunrise rays -->
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
        <div
          v-for="ray in 8"
          :key="ray"
          class="absolute bottom-0 left-1/2 origin-bottom sunrise-ray"
          :style="{
            width: '2px',
            height: '70%',
            background: `linear-gradient(to top, rgba(255,${180+ray*8},60,0.3), transparent)`,
            transform: `translateX(-50%) rotate(${(ray-4)*18}deg)`,
            animationDelay: `${ray * 0.2}s`
          }"
        />
      </div>
      <!-- warm horizon glow -->
      <div class="absolute bottom-0 left-0 right-0 h-64" style="background: linear-gradient(to top, rgba(255,140,0,0.25), rgba(255,80,0,0.08), transparent);"/>
      <div class="absolute bottom-40 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full sunrise-pulse" style="background: radial-gradient(circle, rgba(255,200,60,0.35), transparent 70%);"/>
    </template>

    <!-- ─── Scene: 量子纠缠 (sample-quantum) ────────────────────────── -->
    <template v-else-if="video.videoId === 'sample-quantum' && camStatus !== 'active'">
      <!-- entangled particle pair -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="relative w-64 h-64">
          <!-- orbit ring -->
          <div class="absolute inset-0 rounded-full border border-violet-400/20 quantum-spin" />
          <div class="absolute inset-6 rounded-full border border-indigo-400/15 quantum-spin-rev" />
          <!-- particle A -->
          <div class="absolute w-4 h-4 rounded-full bg-violet-400 quantum-orbit-a" style="box-shadow: 0 0 16px 4px rgba(139,92,246,0.7);" />
          <!-- particle B -->
          <div class="absolute w-4 h-4 rounded-full bg-cyan-400 quantum-orbit-b" style="box-shadow: 0 0 16px 4px rgba(34,211,238,0.7);" />
          <!-- entanglement line -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-40 h-px bg-gradient-to-r from-violet-400/0 via-white/30 to-cyan-400/0 entangle-pulse" />
          </div>
        </div>
      </div>
      <!-- star background -->
      <svg class="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
        <circle v-for="(s, i) in stars.slice(0,40)" :key="i" :cx="`${s.x}%`" :cy="`${s.y}%`" :r="s.r" fill="white" :opacity="0.2 + (i%4)*0.1">
          <animate attributeName="opacity" :values="`${0.2};0.8;0.2`" :dur="`${s.dur}s`" repeatCount="indefinite"/>
        </circle>
      </svg>
    </template>

    <!-- ─── Scene: 黑洞 (sample-blackhole) ───────────────────────────── -->
    <template v-else-if="video.videoId === 'sample-blackhole' && camStatus !== 'active'">
      <!-- accretion disk rings -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none" style="margin-top: -10%;">
        <div class="relative flex items-center justify-center">
          <!-- event horizon -->
          <div class="absolute w-24 h-24 rounded-full bg-black" style="box-shadow: 0 0 0 3px rgba(255,140,0,0.3), 0 0 60px 20px rgba(255,80,0,0.2);" />
          <!-- accretion rings -->
          <div
            v-for="ring in 5" :key="ring"
            class="absolute rounded-full border-0 accretion-spin"
            :style="{
              width: `${80 + ring * 28}px`,
              height: `${80 + ring * 28}px`,
              background: `conic-gradient(from 0deg, transparent 40%, rgba(${255},${140 - ring*20},${0},${0.5 - ring*0.08}) 60%, rgba(255,200,80,${0.4 - ring*0.06}) 75%, transparent 90%)`,
              animationDuration: `${4 + ring * 1.5}s`,
              filter: `blur(${ring * 0.5}px)`
            }"
          />
          <!-- gravitational lensing glow -->
          <div class="absolute w-72 h-72 rounded-full" style="background: radial-gradient(circle, transparent 30%, rgba(255,80,0,0.06) 50%, transparent 70%);" />
        </div>
      </div>
      <!-- star field -->
      <svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <circle v-for="(s, i) in stars" :key="i" :cx="`${s.x}%`" :cy="`${s.y}%`" :r="s.r" fill="white" :opacity="0.15 + (i%4)*0.08"/>
      </svg>
    </template>

    <!-- ─── Default light spots (other videos) ───────────────────────── -->
    <template v-else-if="camStatus !== 'active'">
      <div
        class="absolute inset-0 opacity-50"
        style="background-image: radial-gradient(circle at 20% 25%, rgba(255,255,255,0.18) 0, transparent 40%), radial-gradient(circle at 80% 75%, rgba(255,255,255,0.12) 0, transparent 45%);"
      />
    </template>

    <!-- ─── 摄像头画面 (always in DOM for ref) ───────────────────────── -->
    <video
      ref="cameraEl"
      v-show="camStatus === 'active'"
      class="absolute inset-0 w-full h-full object-cover"
      autoplay muted playsinline
      style="transform: scaleX(-1);"
    />

    <!-- 摄像头状态遮罩 -->
    <div
      v-if="cameraActive && camStatus !== 'active'"
      class="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10"
    >
      <template v-if="camStatus === 'requesting'">
        <svg class="animate-spin w-10 h-10 text-white/60 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        <p class="text-white/70 text-sm">正在请求摄像头权限…</p>
      </template>
      <template v-else-if="camStatus === 'error'">
        <svg class="w-10 h-10 text-rose-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p class="text-rose-300 text-sm text-center px-8">{{ camError }}</p>
        <button
          class="mt-4 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm hover:bg-white/25"
          @click.stop="emit('camera-close')"
        >关闭</button>
      </template>
    </div>

    <!-- 关闭摄像头按钮 -->
    <button
      v-if="camStatus === 'active'"
      class="absolute top-24 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium pointer-events-auto"
      @click.stop="emit('camera-close')"
    >
      <svg viewBox="0 0 24 24" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M23 7 16 12 23 17V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/>
        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" stroke-width="2"/>
      </svg>
      关闭摄像头
    </button>

    <!-- 底部渐变遮罩 -->
    <div class="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

    <!-- 底部作者 + 标题 + 话题 -->
    <div v-if="camStatus !== 'active'" class="absolute left-3 right-20 bottom-16 z-10 text-white space-y-1">
      <div class="text-[14px] font-bold drop-shadow">{{ video.author }}</div>
      <div class="text-[13px] leading-snug drop-shadow line-clamp-2 text-white/90">{{ video.title }}</div>
      <div class="flex flex-wrap gap-x-2 gap-y-0.5 text-[12px] text-white/80 drop-shadow">
        <span v-for="h in hashtags" :key="h">{{ h }}</span>
      </div>
      <div class="flex items-center gap-1 text-[11px] text-white/60 pt-0.5">
        <svg viewBox="0 0 24 24" class="w-3 h-3 animate-spin" style="animation-duration: 6s" fill="currentColor">
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        <span>原声 · {{ video.category }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* rocket gently rising */
@keyframes rocketRise {
  0%, 100% { transform: translateX(-50%) translateY(0px); }
  50%       { transform: translateX(-50%) translateY(-18px); }
}
.rocket-rise {
  animation: rocketRise 4s ease-in-out infinite;
}

/* soft particle float */
@keyframes particleFloat {
  0%   { transform: translateY(0) scale(1); opacity: 0; }
  10%  { opacity: 1; }
  90%  { opacity: 0.6; }
  100% { transform: translateY(-100vh) scale(0.6); opacity: 0; }
}
.particle-float {
  animation: particleFloat linear infinite;
}

/* sunrise ray pulse */
@keyframes sunriseRay {
  0%, 100% { opacity: 0.3; }
  50%       { opacity: 0.8; }
}
.sunrise-ray {
  animation: sunriseRay 3s ease-in-out infinite;
}

/* sunrise center glow */
@keyframes sunrisePulse {
  0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.35; }
  50%       { transform: translateX(-50%) scale(1.3); opacity: 0.6; }
}
.sunrise-pulse {
  animation: sunrisePulse 3s ease-in-out infinite;
}

/* scrolling code text */
@keyframes codeScroll {
  0%   { transform: translateY(0); }
  100% { transform: translateY(-50%); }
}
.code-scroll {
  animation: codeScroll 20s linear infinite;
}

/* quantum spin */
@keyframes quantumSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes quantumSpinRev { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
.quantum-spin { animation: quantumSpin 8s linear infinite; }
.quantum-spin-rev { animation: quantumSpinRev 12s linear infinite; }

@keyframes quantumOrbitA {
  0%   { transform: translate(0px, -120px); }
  25%  { transform: translate(120px, 0px); }
  50%  { transform: translate(0px, 120px); }
  75%  { transform: translate(-120px, 0px); }
  100% { transform: translate(0px, -120px); }
}
@keyframes quantumOrbitB {
  0%   { transform: translate(0px, 120px); }
  25%  { transform: translate(-120px, 0px); }
  50%  { transform: translate(0px, -120px); }
  75%  { transform: translate(120px, 0px); }
  100% { transform: translate(0px, 120px); }
}
.quantum-orbit-a { animation: quantumOrbitA 6s linear infinite; }
.quantum-orbit-b { animation: quantumOrbitB 6s linear infinite; }

@keyframes entanglePulse {
  0%, 100% { opacity: 0.2; transform: scaleX(0.8); }
  50%       { opacity: 0.8; transform: scaleX(1.2); }
}
.entangle-pulse { animation: entanglePulse 2s ease-in-out infinite; }

/* accretion disk */
@keyframes accretionSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.accretion-spin { animation: accretionSpin linear infinite; }
</style>
