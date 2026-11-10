import { useEffect, useState } from "react";
import { sampleSrc } from "../data/voice";
import type { SampleVoiceId } from "../lib/samples";
import { claimSpeaker, watchSpeakers } from "../lib/speaker";

/** 全站同一时间只放一句「听一听」；动画开口说话时也停下 */
let current: HTMLAudioElement | null = null;
const listeners = new Set<() => void>();
const speaker = "say";
watchSpeakers(speaker, () => current?.pause());

function play(src: string) {
  current?.pause();
  claimSpeaker(speaker);
  const audio = new Audio(src);
  current = audio;
  const done = () => {
    if (current === audio) current = null;
    for (const listener of listeners) listener();
  };
  audio.addEventListener("ended", done);
  audio.addEventListener("pause", done);
  audio.play().catch((error: unknown) => {
    console.error("听一听放不出来", error);
    done();
  });
  for (const listener of listeners) listener();
}

/** 用合成的方言音色读一句话；没有音频时什么也不画 */
export function SayButton({ voice, text, label }: { voice?: SampleVoiceId; text?: string; label?: string }) {
  const src = sampleSrc(voice, text);
  const [, refresh] = useState(0);
  useEffect(() => {
    const listener = () => refresh((n) => n + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);
  if (!src) return null;
  const playing = current !== null && current.src.endsWith(src.replace(/^\.\//, ""));
  return (
    <button type="button" className={playing ? "say-button is-playing" : "say-button"} onClick={(event) => { event.stopPropagation(); play(src); }}
      aria-label={`听一听：${text}`} title="听一听">
      {playing ? "🔉" : "🔊"}{label && <span>{label}</span>}
    </button>
  );
}
