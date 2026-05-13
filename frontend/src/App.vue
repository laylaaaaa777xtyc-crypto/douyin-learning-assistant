<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';
import TopBar from './components/TopBar.vue';
import BottomNav from './components/BottomNav.vue';
import VideoStage from './components/VideoStage.vue';
import RightActionBar from './components/RightActionBar.vue';
import AIStatusBubble from './components/AIStatusBubble.vue';
import DialogueBubble from './components/DialogueBubble.vue';
import CharacterTabBar from './components/CharacterTabBar.vue';

const AIOverlay = defineAsyncComponent(() => import('./components/AIOverlay.vue'));
const MindmapOverlay = defineAsyncComponent(() => import('./components/MindmapOverlay.vue'));
import { CHARACTERS, type CharacterId } from './config/characters.config';
import { useAnalyze } from './composables/useAnalyze';
import { SAMPLE_VIDEOS } from './services/mockData';

const activeCharacterId = ref<CharacterId>('ghostie');
const activeVideoIndex = ref(0);
const showMindmap = ref(false);
const showStatusBubble = ref(true);
const cameraActive = ref(false);

const activeVideo = computed(() => SAMPLE_VIDEOS[activeVideoIndex.value]);
const activeCharacter = computed(
  () => CHARACTERS.find((c) => c.id === activeCharacterId.value) ?? CHARACTERS[0]
);

const { state, run } = useAnalyze();

async function reanalyze() {
  await run({
    videoId: activeVideo.value.videoId,
    transcript: activeVideo.value.transcript,
    characterId: activeCharacterId.value
  });
}

onMounted(reanalyze);

function switchCharacter(id: CharacterId) {
  if (id === activeCharacterId.value) return;
  activeCharacterId.value = id;
  showStatusBubble.value = true;
  reanalyze();
}

function nextVideo() {
  activeVideoIndex.value = (activeVideoIndex.value + 1) % SAMPLE_VIDEOS.length;
  showStatusBubble.value = true;
  reanalyze();
}

function openMindmap() {
  if (state.value.status === 'success') showMindmap.value = true;
}

function openReport() {
  console.log('open daily report');
}

function openCamera() {
  cameraActive.value = true;
}

function closeCamera() {
  cameraActive.value = false;
}
</script>

<template>
  <div class="relative w-full h-full overflow-hidden bg-black select-none">
    <VideoStage
      :video="activeVideo"
      :camera-active="cameraActive"
      @swipe-up="nextVideo"
      @camera-close="closeCamera"
    />

    <AIOverlay :character="activeCharacter" />

    <TopBar @go-live="openCamera" />

    <AIStatusBubble
      v-if="showStatusBubble"
      :character="activeCharacter"
      :state="state"
      @close="showStatusBubble = false"
    />

    <CharacterTabBar
      :characters="CHARACTERS"
      :active-id="activeCharacterId"
      @select="switchCharacter"
    />

    <RightActionBar
      :likes="activeVideo.likes"
      :comments="activeVideo.comments"
      :favorites="activeVideo.favorites"
      :shares="activeVideo.shares"
    />

    <DialogueBubble
      :character="activeCharacter"
      :state="state"
      :video="activeVideo"
      @open-mindmap="openMindmap"
      @open-report="openReport"
      @retry="reanalyze"
    />

    <BottomNav />

    <MindmapOverlay
      v-if="showMindmap && state.status === 'success' && state.data"
      :data="state.data"
      :character="activeCharacter"
      @close="showMindmap = false"
    />
  </div>
</template>
