// Teaching motion is a pure function of a phase p in [0, 1): it can be paused, scrubbed and stepped,
// and the same phase always yields the same pose and the same caption.
export const TAU = Math.PI * 2;

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export const wrap01 = (p: number) => ((p % 1) + 1) % 1;

export function smooth(x: number): number {
  const t = clamp01(x);
  return t * t * (3 - 2 * t);
}

/** 0 outside (start, end), rising smoothly to 1 at `peak`. */
export function bump(p: number, start: number, peak: number, end: number): number {
  if (!(start < peak && peak < end)) throw new RangeError("bump 需要 start < peak < end");
  if (p <= start || p >= end) return 0;
  return p < peak ? smooth((p - start) / (peak - start)) : 1 - smooth((p - peak) / (end - peak));
}

/** One smooth up-and-down per cycle, 0 at the loop seam. */
export const wave = (p: number) => (1 - Math.cos(TAU * p)) / 2;

/** Lung fill: a quicker inhale over the first 40% of a breath, then a slower exhale. */
export function breath(p: number): number {
  const q = wrap01(p);
  return q < 0.4 ? smooth(q / 0.4) : 1 - smooth((q - 0.4) / 0.6);
}

/**
 * Travel that advances exactly one unit per cycle, all of it between `start` and `end`.
 * Particles placed at (i + n·pulseTravel) / count look identical at p = 0 and p = 1, so loops are seamless.
 */
export function pulseTravel(p: number, start: number, end: number): number {
  return smooth((wrap01(p) - start) / (end - start));
}

export type MotionStage = { start: number; label: string };

export function stageIndexAt(stages: readonly MotionStage[], p: number): number {
  if (!stages.length) throw new RangeError("至少需要一个阶段");
  const q = wrap01(p);
  let index = 0;
  for (let i = 0; i < stages.length; i += 1) if (stages[i].start <= q) index = i;
  return index;
}

export const maxFrameSeconds = 0.12;

export function advancePhase(phase: number, dtSeconds: number, durationSeconds: number, speed: number): number {
  if (!(durationSeconds > 0)) throw new RangeError("动画时长必须大于 0");
  const dt = Math.min(Math.max(dtSeconds, 0), maxFrameSeconds);
  return wrap01(phase + (dt * speed) / durationSeconds);
}

export const stepSize = 0.025;

export function stepPhase(phase: number, direction: 1 | -1 = 1): number {
  return wrap01(phase + direction * stepSize);
}
