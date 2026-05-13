import { ref, onBeforeUnmount } from 'vue';

export type CameraStatus = 'idle' | 'requesting' | 'active' | 'error';

export function useCamera() {
  const status = ref<CameraStatus>('idle');
  const error = ref<string | null>(null);
  let stream: MediaStream | null = null;

  async function start(videoEl: HTMLVideoElement) {
    if (status.value === 'active') return;
    status.value = 'requesting';
    error.value = null;

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'user' }, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });

      // ① assign stream BEFORE touching any other property
      videoEl.srcObject = stream;

      // ② muted is mandatory — browsers block autoplay with audio
      videoEl.muted = true;

      // ③ playsinline prevents iOS from going full-screen and breaking the feed
      videoEl.setAttribute('playsinline', 'true');

      // ④ wait for the decoder to know the frame dimensions before playing;
      //    skipping this is the #1 cause of a permanent black frame
      if (videoEl.readyState < HTMLMediaElement.HAVE_METADATA) {
        await new Promise<void>((resolve, reject) => {
          const onMeta = () => { cleanup(); resolve(); };
          const onErr  = () => { cleanup(); reject(new Error('video error')); };
          const cleanup = () => {
            videoEl.removeEventListener('loadedmetadata', onMeta);
            videoEl.removeEventListener('error', onErr);
          };
          videoEl.addEventListener('loadedmetadata', onMeta, { once: true });
          videoEl.addEventListener('error', onErr, { once: true });
        });
      }

      // ⑤ explicit play() — never rely on the autoplay attribute alone
      await videoEl.play();

      status.value = 'active';
    } catch (err_: unknown) {
      const msg = err_ instanceof Error ? err_.message : String(err_);
      error.value = msg.includes('Permission') || msg.includes('NotAllowed')
        ? '请在浏览器设置中允许访问摄像头'
        : `摄像头错误：${msg}`;
      stop(videoEl);
      status.value = 'error';
    }
  }

  function stop(videoEl?: HTMLVideoElement) {
    stream?.getTracks().forEach((t) => t.stop());
    stream = null;
    if (videoEl) {
      videoEl.srcObject = null;
      videoEl.load(); // reset decoder state
    }
    if (status.value !== 'error') status.value = 'idle';
  }

  onBeforeUnmount(() => stop());

  return { status, error, start, stop };
}
