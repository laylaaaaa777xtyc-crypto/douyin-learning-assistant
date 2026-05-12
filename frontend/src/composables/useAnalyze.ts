import { ref } from 'vue';
import { analyzeVideo } from '../services/api';
import type { AnalyzeRequest, AnalyzeResponse } from '../types/api';

export type AnalyzeStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AnalyzeState {
  status: AnalyzeStatus;
  data: AnalyzeResponse | null;
  error: string | null;
}

export function useAnalyze() {
  const state = ref<AnalyzeState>({ status: 'idle', data: null, error: null });
  let token = 0;

  async function run(req: AnalyzeRequest) {
    const my = ++token;
    state.value = { status: 'loading', data: state.value.data, error: null };
    try {
      const data = await analyzeVideo(req);
      if (my !== token) return;
      state.value = { status: 'success', data, error: null };
    } catch (err) {
      if (my !== token) return;
      const msg = err instanceof Error ? err.message : String(err);
      state.value = { status: 'error', data: null, error: msg };
    }
  }

  return { state, run };
}
