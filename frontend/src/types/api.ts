export interface SimpleExplanation {
  term: string;
  explanation: string;
}

export interface LogicTree {
  mainArgument: string;
  supportPoints: string[];
  potentialFlaws: string[];
  score: number;
}

export interface Reconstruction {
  simpleExplanations: SimpleExplanation[];
  logicTree: LogicTree;
  actionTips: string[];
}

export interface Classification {
  category: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface BackendCharacter {
  id: string;
  name: string;
  avatarHint: string;
}

export interface AnalyzeResponse {
  videoId: string;
  classification: Classification;
  character: BackendCharacter;
  reconstruction: Reconstruction;
  mindmapMermaid: string;
  cached?: boolean;
  fallback?: boolean;
}

export interface AnalyzeRequest {
  videoId: string;
  transcript: string;
  characterId?: string;
}

export interface EvaluationScores {
  logicRigor: number;
  knowledgeUtility: number;
  ethicalSafety: number;
}
