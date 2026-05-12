import type { AnalyzeRequest, AnalyzeResponse } from '../types/api';
import { buildMockAnalyzeResponse } from './mockData';

const API_BASE = (import.meta.env.VITE_API_BASE as string) || '/api';
const FORCE_MOCK = import.meta.env.VITE_FORCE_MOCK === 'true';

export async function analyzeVideo(req: AnalyzeRequest): Promise<AnalyzeResponse> {
  if (FORCE_MOCK) return buildMockAnalyzeResponse(req);

  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    });
    const json = await res.json();
    if (!res.ok || json.success === false) {
      throw new Error(json.error || `HTTP ${res.status}`);
    }
    return json.data as AnalyzeResponse;
  } catch (err) {
    console.warn('[api] analyze failed, falling back to mock:', err);
    return buildMockAnalyzeResponse(req);
  }
}
