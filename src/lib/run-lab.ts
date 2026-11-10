// 首页小星球上小念和爸爸的动作状态。3D 场景和身体奇遇记共用，这里只留站着聊天要用的部分。
export const restBpm = 90;
export const maxRunBpm = 150;
export const restBreaths = 20;
export const maxRunBreaths = 40;

export type Vitals = { restBpm: number; maxRunBpm: number; restBreaths: number; maxRunBreaths: number };
export const childVitals: Vitals = { restBpm, maxRunBpm, restBreaths, maxRunBreaths };

export type BodyState = {
  vitals: Vitals;
  effort: number;
  bpm: number;
  breaths: number;
  beatPhase: number;
  breathPhase: number;
  warmth: number;
  peakBpm: number;
};

export function createBodyState(vitals: Vitals = childVitals): BodyState {
  return { vitals, effort: 0, bpm: vitals.restBpm, breaths: vitals.restBreaths, beatPhase: 0, breathPhase: 0, warmth: 0, peakBpm: vitals.restBpm };
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function exertionOf({ bpm, vitals = childVitals }: { bpm: number; vitals?: Vitals }): number {
  return clamp01((bpm - vitals.restBpm) / (vitals.maxRunBpm - vitals.restBpm));
}

/** 一次心跳（0～1）里心脏收缩多少：先一下重的，再一下轻的 */
export function heartSqueeze(phase: number): number {
  const p = ((phase % 1) + 1) % 1;
  const bump = (center: number, width: number) => Math.exp(-(((p - center) / width) ** 2));
  return Math.min(1, bump(0.06, 0.06) + 0.55 * bump(0.26, 0.06));
}

/** 一次呼吸（0～1）里胸口鼓起多少：前 40% 吸气，后面呼气 */
export function breathFill(phase: number): number {
  const p = ((phase % 1) + 1) % 1;
  return p < 0.4 ? Math.sin((p / 0.4) * (Math.PI / 2)) : Math.cos(((p - 0.4) / 0.6) * (Math.PI / 2));
}

export type Motion = { clip: "Idle" | "Walk" | "Run"; timeScale: number };

export function motionFor(effort: number): Motion {
  if (effort < 0.12) return { clip: "Idle", timeScale: 1 };
  if (effort < 0.5) return { clip: "Walk", timeScale: 0.8 + effort };
  return { clip: "Run", timeScale: 0.75 + effort * 0.45 };
}

export function canUseWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
