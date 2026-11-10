import type { Speaker } from "../lib/narration";
import { sampleKey, type SampleVoiceId } from "../lib/samples";
import type { DialectQuestion } from "./questions/types";
import manifest from "./voice-manifest.json";

/** 小念和爸爸的配音，由 `npm run voice` 生成到 public/voice/ */
export type FilmVoice = {
  readonly turnCount: number;
  readonly lengthOf: (turn: number, who: Speaker) => number | undefined;
  readonly src: (turn: number, who: Speaker) => string;
};

type Manifest = { clips: Record<string, { hash: string; seconds: number }>; samples: Record<string, { text: string; seconds: number }> };
const { clips, samples } = manifest as unknown as Manifest;
const base = import.meta.env.BASE_URL;

export function voiceFor(question: DialectQuestion): FilmVoice | undefined {
  const key = (turn: number, who: Speaker) => `${question.id}/${turn}-${who}`;
  if (!clips[key(0, "nian")]) return undefined;
  return {
    turnCount: question.dialogue.length,
    lengthOf: (turn, who) => clips[key(turn, who)]?.seconds,
    src: (turn, who) => `${base}voice/${key(turn, who)}.mp3`
  };
}

/** 「听一听」的音频地址；没生成过就返回 undefined，页面上不出按钮 */
export function sampleSrc(voice: SampleVoiceId | undefined, text: string | undefined): string | undefined {
  if (!voice || !text) return undefined;
  const key = sampleKey(voice, text);
  return samples[key] ? `${base}voice/say/${key}.mp3` : undefined;
}
