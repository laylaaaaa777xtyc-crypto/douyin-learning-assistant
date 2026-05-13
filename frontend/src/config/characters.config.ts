export type CharacterId =
  | 'scholar-cat'
  | 'mecha-dragon'
  | 'spirit-deer'
  | 'brave-dog'
  | 'ghostie';

export type MeshKind = 'book' | 'dodecahedron' | 'torus' | 'octahedron' | 'sphere';

export interface CharacterTheme {
  primary: string;
  glow: string;
  text: string;
  ring: string;
  bubbleBg: string;
}

export interface CharacterConfig {
  id: CharacterId;
  name: string;
  nameEn: string;
  emoji: string;
  tagline: string;
  catchphrase: string;
  theme: CharacterTheme;
  videoSrc?: string;
  mesh: {
    kind: MeshKind;
    rotationSpeed: number;
    floatAmp: number;
    wireframe?: boolean;
    opacity?: number;
  };
}

export const CHARACTERS: CharacterConfig[] = [
  {
    id: 'scholar-cat',
    name: '学者猫',
    nameEn: 'Scholar Cat',
    emoji: '🐱',
    tagline: '把学术翻译成大白话',
    catchphrase: '嗯~ 让我想想喵，这个就要从根源说起了。',
    theme: {
      primary: '#D4A373',
      glow: 'rgba(212, 163, 115, 0.45)',
      text: '#FFF3DD',
      ring: 'ring-amber-300/60',
      bubbleBg: 'rgba(212, 163, 115, 0.18)'
    },
    videoSrc: '/characters/scholar-cat.webm',
    mesh: { kind: 'book', rotationSpeed: 0.4, floatAmp: 0.08 }
  },
  {
    id: 'mecha-dragon',
    name: '机械龙',
    nameEn: 'Mecha Dragon',
    emoji: '🐉',
    tagline: '把感性内容结构化',
    catchphrase: '数据表明，这段内容的核心可以被拆解为三个变量。',
    theme: {
      primary: '#3E5C76',
      glow: 'rgba(120, 180, 255, 0.55)',
      text: '#DCE9F7',
      ring: 'ring-sky-300/60',
      bubbleBg: 'rgba(62, 92, 118, 0.4)'
    },
    mesh: { kind: 'dodecahedron', rotationSpeed: 0.8, floatAmp: 0.04, wireframe: true }
  },
  {
    id: 'spirit-deer',
    name: '精灵鹿',
    nameEn: 'Spirit Deer',
    emoji: '🦌',
    tagline: '把尖锐的内容软化',
    catchphrase: '没关系的，慢慢来，我在听你说。',
    theme: {
      primary: '#F4A4B6',
      glow: 'rgba(244, 164, 182, 0.55)',
      text: '#FFE7EE',
      ring: 'ring-pink-300/60',
      bubbleBg: 'rgba(244, 164, 182, 0.22)'
    },
    videoSrc: '/characters/spirit-deer.webm',
    mesh: { kind: 'torus', rotationSpeed: 0.5, floatAmp: 0.1 }
  },
  {
    id: 'brave-dog',
    name: '勇者犬',
    nameEn: 'Brave Dog',
    emoji: '🐕',
    tagline: '把内容翻译成行动指令',
    catchphrase: '伙伴！这是今天的第一关 Boss，冲就完了！',
    theme: {
      primary: '#E76F51',
      glow: 'rgba(231, 111, 81, 0.55)',
      text: '#FFE2D6',
      ring: 'ring-orange-300/60',
      bubbleBg: 'rgba(231, 111, 81, 0.22)'
    },
    videoSrc: '/characters/brave-dog.webm',
    mesh: { kind: 'octahedron', rotationSpeed: 1.0, floatAmp: 0.14 }
  },
  {
    id: 'ghostie',
    name: '小幽灵',
    nameEn: 'Ghostie',
    emoji: '👻',
    tagline: '把内容里的焦虑过滤掉',
    catchphrase: '复杂的知识，我帮你"翻译"成大白话~',
    theme: {
      primary: '#B8A4D4',
      glow: 'rgba(184, 164, 212, 0.55)',
      text: '#EFE6FB',
      ring: 'ring-purple-300/60',
      bubbleBg: 'rgba(184, 164, 212, 0.22)'
    },
    mesh: { kind: 'sphere', rotationSpeed: 0.25, floatAmp: 0.12, opacity: 0.65 }
  }
];

export function getCharacter(id: CharacterId): CharacterConfig {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}
