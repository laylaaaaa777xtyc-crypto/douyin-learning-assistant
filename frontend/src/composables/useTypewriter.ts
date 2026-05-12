import { ref, watch, onBeforeUnmount, type Ref } from 'vue';

interface Options {
  speed?: number;
  startDelay?: number;
}

export function useTypewriter(source: Ref<string>, opts: Options = {}) {
  const speed = opts.speed ?? 38;
  const startDelay = opts.startDelay ?? 80;

  const displayed = ref('');
  const isTyping = ref(false);
  let timer: number | null = null;
  let cursor = 0;

  function clear() {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  }

  function reset() {
    clear();
    displayed.value = '';
    cursor = 0;
    isTyping.value = false;
  }

  function tick(full: string) {
    if (cursor >= full.length) {
      isTyping.value = false;
      timer = null;
      return;
    }
    cursor += 1;
    displayed.value = full.slice(0, cursor);
    timer = window.setTimeout(() => tick(full), speed);
  }

  function play(full: string) {
    reset();
    if (!full) return;
    isTyping.value = true;
    timer = window.setTimeout(() => tick(full), startDelay);
  }

  watch(source, (next) => play(next ?? ''), { immediate: true });

  function skip() {
    if (!isTyping.value) return;
    clear();
    displayed.value = source.value;
    cursor = source.value.length;
    isTyping.value = false;
  }

  onBeforeUnmount(reset);

  return { displayed, isTyping, skip, reset };
}
