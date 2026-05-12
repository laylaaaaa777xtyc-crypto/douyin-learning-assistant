<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import * as THREE from 'three';
import type { CharacterConfig, MeshKind } from '../config/characters.config';

const props = defineProps<{ character: CharacterConfig }>();

const container = ref<HTMLDivElement | null>(null);
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let activeMesh: THREE.Object3D | null = null;
let frameId = 0;
let resizeObserver: ResizeObserver | null = null;

function buildMesh(kind: MeshKind, color: string, opts: { wireframe?: boolean; opacity?: number }) {
  const tone = new THREE.Color(color);

  let geometry: THREE.BufferGeometry;
  switch (kind) {
    case 'book':
      geometry = new THREE.BoxGeometry(1.4, 1.8, 0.35);
      break;
    case 'dodecahedron':
      geometry = new THREE.DodecahedronGeometry(1.1, 0);
      break;
    case 'torus':
      geometry = new THREE.TorusGeometry(0.9, 0.32, 18, 60);
      break;
    case 'octahedron':
      geometry = new THREE.OctahedronGeometry(1.2, 0);
      break;
    case 'sphere':
    default:
      geometry = new THREE.SphereGeometry(1.05, 32, 32);
      break;
  }

  if (opts.wireframe) {
    const mat = new THREE.MeshBasicMaterial({ color: tone, wireframe: true, transparent: true, opacity: 0.85 });
    return new THREE.Mesh(geometry, mat);
  }

  const mat = new THREE.MeshStandardMaterial({
    color: tone,
    transparent: (opts.opacity ?? 1) < 1,
    opacity: opts.opacity ?? 1,
    roughness: 0.35,
    metalness: 0.2,
    emissive: tone.clone().multiplyScalar(0.25)
  });
  return new THREE.Mesh(geometry, mat);
}

function setupCharacter(character: CharacterConfig) {
  if (!scene) return;
  if (activeMesh) {
    scene.remove(activeMesh);
    (activeMesh as THREE.Mesh).geometry?.dispose?.();
    const mat = (activeMesh as THREE.Mesh).material;
    if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
    else mat?.dispose?.();
  }
  activeMesh = buildMesh(character.mesh.kind, character.theme.primary, {
    wireframe: character.mesh.wireframe,
    opacity: character.mesh.opacity
  });
  scene.add(activeMesh);
}

function init() {
  if (!container.value) return;

  const w = container.value.clientWidth;
  const h = container.value.clientHeight;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  container.value.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 0, 4);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(2, 3, 4);
  scene.add(key);
  const rim = new THREE.PointLight(0xff99cc, 0.6, 10);
  rim.position.set(-3, -2, 2);
  scene.add(rim);

  setupCharacter(props.character);

  const start = performance.now();
  const animate = () => {
    if (!renderer || !scene || !camera) return;
    frameId = requestAnimationFrame(animate);
    const t = (performance.now() - start) / 1000;
    if (activeMesh) {
      activeMesh.rotation.y = t * props.character.mesh.rotationSpeed;
      activeMesh.rotation.x = Math.sin(t * 0.6) * 0.25;
      activeMesh.position.y = Math.sin(t * 1.2) * props.character.mesh.floatAmp;
    }
    renderer.render(scene, camera);
  };
  animate();

  resizeObserver = new ResizeObserver(() => {
    if (!container.value || !renderer || !camera) return;
    const nw = container.value.clientWidth;
    const nh = container.value.clientHeight;
    renderer.setSize(nw, nh);
    camera.aspect = nw / nh;
    camera.updateProjectionMatrix();
  });
  resizeObserver.observe(container.value);
}

onMounted(init);

watch(
  () => props.character.id,
  () => setupCharacter(props.character)
);

onBeforeUnmount(() => {
  cancelAnimationFrame(frameId);
  resizeObserver?.disconnect();
  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
  }
});
</script>

<template>
  <div class="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
    <div
      class="relative w-48 h-48 rounded-full overflow-hidden"
      :style="{
        boxShadow: `0 0 90px 10px ${character.theme.glow}`,
        background: 'radial-gradient(circle at center, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0) 70%)'
      }"
    >
      <div ref="container" class="w-full h-full" />
    </div>
  </div>
</template>
