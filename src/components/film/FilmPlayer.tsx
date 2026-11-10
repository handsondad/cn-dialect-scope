import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from "react";
import type { Film } from "../../data/films/types";
import type { FilmVoice } from "../../data/voice";
import { useInView } from "../../hooks/useInView";
import { sceneAt, sceneStart, totalDuration } from "../../lib/film";
import { maxFrameSeconds } from "../../lib/motion";
import { lineAt, narrateFilm, narrationGaps, type Speaker, type SpokenLine } from "../../lib/narration";
import { claimSpeaker, watchSpeakers } from "../../lib/speaker";
import { FilmStage } from "./FilmStage";
import "./Film.css";

export type FilmPlayerHandle = {
  /** 跳到第 turn 轮问答开始播放 */
  playTurn: (turn: number) => void;
};

type Props = {
  film: Film;
  /** 有配音时，小念和爸爸会把问答读出来，动画跟着声音放慢 */
  voice?: FilmVoice;
  /** 正在讲第几轮问答；有配音时 who 是正在说话的人 */
  onTurn?: (turn: number, who?: Speaker) => void;
};

const voiceKey = "dialectverse-film-voice";

function readVoicePreference() {
  try {
    return window.localStorage.getItem(voiceKey) !== "off";
  } catch {
    return true;
  }
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const format = (seconds: number) => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;

const lineKey = (line: SpokenLine) => `${line.turn}-${line.who}`;

export const FilmPlayer = forwardRef<FilmPlayerHandle, Props>(function FilmPlayer({ film, voice, onTurn }, ref) {
  const narrated = useMemo(() => (voice ? narrateFilm(film, voice.turnCount, voice.lengthOf) : undefined), [film, voice]);
  const [voiceOn, setVoiceOn] = useState(readVoicePreference);
  const speaking = voiceOn && narrated !== undefined;
  const active = speaking ? narrated.film : film;
  const lines = useMemo(() => (speaking ? narrated.lines : []), [speaking, narrated]);
  const total = useMemo(() => totalDuration(active), [active]);

  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const playingRef = useRef(playing);
  playingRef.current = playing;
  const [rootRef, inView] = useInView<HTMLDivElement>(false);
  const autoStarted = useRef(false);
  const playerId = useId();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  /** 正在放的那句配音；放着的时候动画的时钟跟着声音走 */
  const clipRef = useRef<SpokenLine | null>(null);
  const { index, local } = sceneAt(active, time);
  const scene = active.scenes[index];
  const ended = time >= total;

  const audio = () => (audioRef.current ??= Object.assign(new Audio(), { preload: "auto" }));

  const stopVoice = useCallback(() => {
    clipRef.current = null;
    audioRef.current?.pause();
  }, []);

  /** 从 at 秒开始放那时该说的话；在点击里直接调用，手机浏览器才肯出声 */
  const startVoice = useCallback((at: number) => {
    const found = voice && lineAt(lines, at);
    if (!voice || !found?.speaking) {
      stopVoice();
      return;
    }
    const player = audio();
    clipRef.current = found.line;
    player.src = voice.src(found.line.turn, found.line.who);
    player.currentTime = Math.max(at - found.line.start, 0);
    claimSpeaker(playerId);
    player.play().catch((error: unknown) => {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        setPlaying(false);
        setNeedsTap(true);
      }
    });
  }, [voice, lines, stopVoice, playerId]);

  useEffect(() => {
    const quiet = () => {
      stopVoice();
      setPlaying(false);
    };
    const unwatch = watchSpeakers(playerId, () => {
      if (clipRef.current || (speaking && playingRef.current)) quiet();
    });
    const onHidden = () => {
      if (document.hidden && clipRef.current) quiet();
    };
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      unwatch();
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [playerId, stopVoice, speaking]);

  const seek = (at: number, play?: boolean) => {
    stopVoice();
    setTime(at);
    if (play !== undefined) setPlaying(play);
    if (play ?? playing) startVoice(at);
  };

  useEffect(() => {
    setTime(0);
    setPlaying(false);
    autoStarted.current = false;
    stopVoice();
  }, [film, stopVoice]);

  useEffect(() => () => stopVoice(), [stopVoice]);

  useEffect(() => {
    if (inView && !autoStarted.current) {
      autoStarted.current = true;
      if (!prefersReducedMotion()) setPlaying(true);
    }
  }, [inView]);

  /** 有声音时滚走了也接着讲，方便一边听一边往下看文字 */
  const running = playing && (inView || speaking);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, maxFrameSeconds);
      last = now;
      setTime((current) => {
        const clip = clipRef.current;
        const player = audioRef.current;
        if (clip && player && !player.paused && !player.ended) {
          if (player.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) return current;
          return Math.min(clip.start + player.currentTime, total);
        }
        return Math.min(current + dt, total);
      });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running, total]);

  useEffect(() => {
    if (ended) setPlaying(false);
  }, [ended]);

  useEffect(() => {
    if (!running || !speaking) {
      if (audioRef.current && !audioRef.current.paused) audioRef.current.pause();
      if (!speaking) clipRef.current = null;
      return;
    }
    const found = lineAt(lines, time);
    if (!found?.speaking) return;
    const current = clipRef.current;
    if (!current || lineKey(current) !== lineKey(found.line)) startVoice(time);
    else if (audioRef.current?.paused && !audioRef.current.ended) startVoice(time);
  }, [time, running, speaking, lines, startVoice]);

  const spoken = speaking ? lineAt(lines, time) : undefined;
  const turn = spoken?.line.turn ?? scene.turn;
  const who = spoken?.speaking ? spoken.line.who : undefined;
  useEffect(() => {
    onTurn?.(turn, who);
  }, [turn, who, onTurn]);

  const startOfTurn = (target: number) => {
    const line = lines.find((item) => item.turn === target);
    if (line) return Math.max(line.start - narrationGaps.lead, 0);
    const sceneIndex = active.scenes.findIndex((item) => item.turn === target);
    return sceneIndex >= 0 ? sceneStart(active, sceneIndex) + 0.001 : undefined;
  };

  useImperativeHandle(ref, () => ({
    playTurn(target) {
      const at = startOfTurn(target);
      if (at !== undefined) seek(at, true);
    }
  }));

  const toggle = () => {
    setNeedsTap(false);
    if (ended) seek(0, true);
    else seek(time, !playing);
  };

  const toggleVoice = () => {
    const next = !voiceOn;
    try {
      window.localStorage.setItem(voiceKey, next ? "on" : "off");
    } catch (error) {
      console.error("声音开关保存失败", error);
    }
    const target = next && narrated ? narrated.film : film;
    const at = sceneStart(target, index) + local * (target.scenes[index].duration / scene.duration);
    stopVoice();
    setVoiceOn(next);
    setNeedsTap(false);
    setTime(at);
  };

  return (
    <div ref={rootRef} className="film" aria-label="动画讲解">
      <FilmStage scene={scene} t={local} isLast={index === active.scenes.length - 1} number={index + 1} />
      <div className="film-controls">
        <button type="button" className={needsTap ? "film-play is-waiting" : "film-play"} onClick={toggle} aria-label={ended ? "再看一遍" : playing ? "暂停" : "播放"}>
          {ended ? "↻" : playing ? "❚❚" : "▶"}
        </button>
        <input
          type="range" min={0} max={total} step={0.05} value={time} aria-label="动画进度"
          onChange={(event) => seek(Number(event.target.value))}
        />
        <span className="film-time">{format(time)} / {format(total)}</span>
        {narrated && (
          <button type="button" className="film-voice" onClick={toggleVoice} aria-pressed={voiceOn} aria-label={voiceOn ? "关掉声音" : "打开声音"} title={voiceOn ? "关掉声音" : "打开声音"}>
            {voiceOn ? "🔊" : "🔇"}
          </button>
        )}
      </div>
      {needsTap && <p className="film-hint">点 ▶ 听小念和爸爸讲</p>}
      <ol className="film-chips" aria-label="分段">
        {active.scenes.map((item, i) => (
          <li key={i}>
            <button type="button" className={i === index ? "is-on" : i < index ? "is-done" : ""} onClick={() => seek(sceneStart(active, i) + 0.001, true)} aria-current={i === index ? "step" : undefined}>
              <b>{i + 1}</b>{item.title}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
});
