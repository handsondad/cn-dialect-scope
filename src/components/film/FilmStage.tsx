import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Cue, FilmScene, Point, ViewId } from "../../data/films/types";
import { cameraAt, ease, envelope, FRAME, partialPath, pathLength, pointAlong, toneChart, tonePoints, toneY, turnAt, type Camera, type Vec } from "../../lib/film";
import { fontFamily, mixedFamily } from "../../lib/fonts";
import { smooth } from "../../lib/motion";
import { MapBackdrop } from "../MapBackdrop";

const ink = "#4a3b2a";
const accent = "#e5483b";

/**
 * 标签、箭头、大字保持屏幕上的大小不变，k = 1 / 镜头放大倍数。
 * ui 在 k 的基础上再按舞台实际宽度放大文字，窄屏上也看得清。
 */
type Ctx = { t: number; k: number; ui: number; alpha: number; camera: Camera };

/** 舞台小于这个宽度（CSS 像素）时放大文字，最多放大 maxLegibility 倍 */
const comfortableWidth = 560;
const maxLegibility = 1.6;

/** 字幕性质的元素：坐标是镜头里的屏幕位置 */
function captionPoint([sx, sy]: Point, ctx: Ctx): Vec {
  return [ctx.camera.x + (sx / FRAME.width) * ctx.camera.width, ctx.camera.y + (sy / FRAME.height) * ctx.camera.height];
}

/** 大字和计数牌常常几块并排，只放大一半，免得互相挤到 */
const captionScale = (ctx: Ctx) => ctx.k * Math.sqrt(ctx.ui / ctx.k);

/** 放大后的文字块不能被画面边缘裁掉 */
function keepInside([x, y]: Vec, halfWidth: number, halfHeight: number, ctx: Ctx): Vec {
  const { camera } = ctx;
  const margin = 6 * ctx.ui;
  const clamp = (value: number, low: number, high: number) => (low > high ? (low + high) / 2 : Math.min(Math.max(value, low), high));
  return [
    clamp(x, camera.x + halfWidth + margin, camera.x + camera.width - halfWidth - margin),
    clamp(y, camera.y + halfHeight + margin, camera.y + camera.height - halfHeight - margin)
  ];
}

const polyline = (points: readonly Vec[]) => points.map((p) => p.join(",")).join(" ");

/** 拉丁字母（拼音、粤拼）比汉字窄，估宽度时按 0.6 个字算 */
const textWidth = (text: string, size: number) => [...text].reduce((sum, char) => sum + (/[\u0000-\u024f]/.test(char) ? 0.6 : 1), 0) * size;

function Backdrop({ view }: { view?: ViewId }) {
  if (view === "map") return <MapBackdrop />;
  if (view === "tones") {
    const names: Record<number, string> = { 5: "高", 3: "中", 1: "低" };
    return (
      <g>
        <line x1={toneChart.left - 20} y1={toneChart.top - 40} x2={toneChart.left - 20} y2={toneChart.bottom + 40} stroke="#c9b48f" strokeWidth={4} />
        {[1, 2, 3, 4, 5].map((level) => (
          <g key={level}>
            <line x1={toneChart.left} y1={toneY(level)} x2={toneChart.right} y2={toneY(level)} stroke="#d9c7a4" strokeWidth={3} strokeDasharray="14 12" />
            <text x={toneChart.left - 60} y={toneY(level)} fontSize={34} fontWeight={800} fill="#9b8461" textAnchor="middle" dominantBaseline="central">{level}</text>
            {names[level] && <text x={toneChart.left - 120} y={toneY(level)} fontSize={28} fill="#b8a07a" textAnchor="middle" dominantBaseline="central">{names[level]}</text>}
          </g>
        ))}
      </g>
    );
  }
  return null;
}

function Label({ cue, ctx }: { cue: Extract<Cue, { kind: "label" }>; ctx: Ctx }) {
  const { k, ui, alpha } = ctx;
  const [ax, ay] = cue.at;
  const side = cue.side ?? (ax < 600 ? "left" : "right");
  const offset: Record<string, Vec> = { left: [-170 * ui, -40 * ui], right: [170 * ui, -40 * ui], top: [0, -120 * ui], bottom: [0, 120 * ui] };
  const size = 30 * ui;
  const width = textWidth(cue.text, size) + 28 * ui;
  const height = size + 20 * ui;
  const [px, py] = keepInside(cue.pos ?? [ax + offset[side][0], ay + offset[side][1]], width / 2, height / 2, ctx);
  const pop = ease.backOut((ctx.t - cue.from) / 0.45);
  const color = cue.color ?? ink;
  return (
    <g opacity={alpha}>
      <line x1={ax} y1={ay} x2={px} y2={py} stroke={color} strokeWidth={3 * k} strokeDasharray={`${8 * k} ${6 * k}`} />
      <circle cx={ax} cy={ay} r={8 * k} fill="#fff" stroke={color} strokeWidth={4 * k} />
      <g transform={`translate(${px} ${py}) scale(${Math.max(pop, 0.01)})`}>
        <rect x={-width / 2} y={-height / 2} width={width} height={height} rx={height / 2} fill="#fff" stroke={color} strokeWidth={3 * k} />
        <text className="film-text" fontSize={size} textAnchor="middle" dominantBaseline="central" fill={color}>{cue.text}</text>
      </g>
    </g>
  );
}

function Highlight({ cue, ctx }: { cue: Extract<Cue, { kind: "highlight" }>; ctx: Ctx }) {
  const [x, y] = cue.at;
  const [w, h] = cue.size ?? [240, 240];
  const color = cue.color ?? "#ffb300";
  const glow = 0.8 + 0.2 * Math.sin(ctx.t * 4);
  return (
    <ellipse
      cx={x} cy={y} rx={w / 2} ry={h / 2}
      fill={color} fillOpacity={0.16 * glow} stroke={color} strokeWidth={5 * ctx.k}
      strokeDasharray={`${16 * ctx.k} ${10 * ctx.k}`} strokeDashoffset={-ctx.t * 40 * ctx.k} opacity={ctx.alpha}
    />
  );
}

function Pulse({ cue, ctx }: { cue: Extract<Cue, { kind: "pulse" }>; ctx: Ctx }) {
  const [x, y] = cue.at;
  const color = cue.color ?? "#ff5a5f";
  const radius = cue.radius ?? 70;
  const rate = cue.rate ?? 1.2;
  const rings = [0, 1, 2].map((i) => {
    const phase = (((ctx.t - cue.from) * rate + i / 3) % 1 + 1) % 1;
    return <circle key={i} cx={x} cy={y} r={radius * phase} fill="none" stroke={color} strokeWidth={6 * ctx.k} opacity={(1 - phase) * ctx.alpha} />;
  });
  return <g>{rings}<circle cx={x} cy={y} r={10 * ctx.k} fill={color} opacity={ctx.alpha} /></g>;
}

function Flow({ cue, ctx }: { cue: Extract<Cue, { kind: "flow" }>; ctx: Ctx }) {
  const points = cue.path;
  const length = Math.max(pathLength(points), 1);
  const count = cue.count ?? 8;
  const speed = cue.speed ?? 220;
  const size = cue.size ?? 10;
  const color = cue.color ?? "#4fb6ff";
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const u = ((((ctx.t - cue.from) * speed) / length + i / count) % 1 + 1) % 1;
        const [x, y] = pointAlong(points, u);
        const edge = Math.min(1, u / 0.08, (1 - u) / 0.08);
        return cue.icon ? (
          <text key={i} x={x} y={y} fontSize={size * 2.6} textAnchor="middle" dominantBaseline="central" opacity={ctx.alpha * edge}>{cue.icon}</text>
        ) : (
          <circle key={i} cx={x} cy={y} r={size} fill={color} stroke="#fff" strokeWidth={2.5} opacity={ctx.alpha * edge} />
        );
      })}
    </g>
  );
}

function Arrow({ cue, ctx }: { cue: Extract<Cue, { kind: "arrow" }>; ctx: Ctx }) {
  const { k } = ctx;
  const points = cue.path;
  const progress = ease.inOut((ctx.t - cue.from) / (cue.draw ?? 0.8));
  const drawn = partialPath(points, Math.max(progress, 0.001));
  const color = cue.color ?? "#ff7a2f";
  const tip = drawn[drawn.length - 1];
  const prev = drawn.length > 1 ? drawn[drawn.length - 2] : points[0];
  const angle = Math.atan2(tip[1] - prev[1], tip[0] - prev[0]);
  const head = 26 * k;
  const wing = (turn: number): Vec => [tip[0] - head * Math.cos(angle + turn), tip[1] - head * Math.sin(angle + turn)];
  const mid = pointAlong(points, 0.5);
  return (
    <g opacity={ctx.alpha}>
      <polyline points={polyline(drawn)} fill="none" stroke="#fff" strokeWidth={15 * k} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={polyline(drawn)} fill="none" stroke={color} strokeWidth={8 * k} strokeLinecap="round" strokeLinejoin="round" />
      {progress > 0.05 && <polygon points={polyline([tip, wing(0.5), wing(-0.5)])} fill={color} stroke="#fff" strokeWidth={3 * k} strokeLinejoin="round" />}
      {cue.text && progress > 0.6 && (
        <text className="film-text" x={mid[0]} y={mid[1] - 30 * ctx.ui} fontSize={28 * ctx.ui} textAnchor="middle" fill={color} opacity={smooth((progress - 0.6) / 0.4)}>{cue.text}</text>
      )}
    </g>
  );
}

function Line({ cue, ctx }: { cue: Extract<Cue, { kind: "line" }>; ctx: Ctx }) {
  const progress = ease.inOut((ctx.t - cue.from) / (cue.draw ?? 0.8));
  const drawn = partialPath(cue.path, Math.max(progress, 0.001));
  const width = cue.width ?? 6;
  return (
    <polyline
      points={polyline(drawn)} fill="none" stroke={cue.color ?? ink} strokeWidth={width}
      strokeDasharray={cue.dashed ? `${width * 3} ${width * 2.2}` : undefined}
      strokeLinecap="round" strokeLinejoin="round" opacity={ctx.alpha}
    />
  );
}

function Sprite({ cue, ctx }: { cue: Extract<Cue, { kind: "sprite" }>; ctx: Ctx }) {
  const points = cue.path;
  const local = ctx.t - cue.from;
  const [x, y] = points.length === 1 ? points[0] : pointAlong(points, ease.inOut(local / (cue.travel ?? 2)));
  const scale = points.length === 1 ? Math.max(ease.backOut(local / 0.5), 0.01) : 1;
  const rotate = turnAt(local, cue.rotate, cue.turnTo, cue.over) + (cue.spin ? local * 160 : cue.wobble ? Math.sin(local * 6) * 10 : 0);
  return (
    <text
      x={0} y={0} fontSize={cue.size ?? 56} textAnchor="middle" dominantBaseline="central" opacity={ctx.alpha}
      transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}
    >
      {cue.icon}
    </text>
  );
}

function Shape({ cue, ctx }: { cue: Extract<Cue, { kind: "shape" }>; ctx: Ctx }) {
  const [x, y] = cue.at;
  const [w, h] = cue.size;
  const local = ctx.t - cue.from;
  let scale = Math.max(ease.backOut(local / 0.5), 0.01);
  let rotate = 0;
  if (cue.motion === "pulse") scale *= 1 + 0.06 * Math.sin(local * 5);
  if (cue.motion === "wiggle") rotate = Math.sin(local * 7) * 5;
  if (cue.motion === "grow") scale *= 0.35 + 0.65 * ease.inOut(local / (cue.over ?? 2));
  if (cue.motion === "shrink") scale *= 1 - 0.55 * ease.inOut(local / (cue.over ?? 2));
  const stroke = cue.outline ? { stroke: ink, strokeWidth: 4, strokeDasharray: "12 8" } : { stroke: "#fff", strokeWidth: 4 };
  const body =
    cue.shape === "circle" ? <ellipse cx={0} cy={0} rx={w / 2} ry={h / 2} fill={cue.color} {...stroke} />
      : <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={cue.shape === "pill" ? h / 2 : Math.min(18, h / 4)} fill={cue.color} {...stroke} />;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`} opacity={ctx.alpha}>
      {body}
      {cue.text && <text className="film-text" fontSize={Math.min(44 * ctx.ui, h * 0.5, (w * 0.85) / textWidth(cue.text, 1))} textAnchor="middle" dominantBaseline="central" fill={ink}>{cue.text}</text>}
    </g>
  );
}

/** 字的中心偏一点：dominant-baseline central 对汉字字体偏上，往下挪一点看着才居中 */
const glyphNudge = 0.04;

export const wordSize = (cue: Extract<Cue, { kind: "word" }>) => cue.size ?? Math.min(200, 900 / [...cue.text].length);

function Word({ cue, ctx }: { cue: Extract<Cue, { kind: "word" }>; ctx: Ctx }) {
  const local = ctx.t - cue.from;
  const size = wordSize(cue);
  const points = cue.path ? [cue.at, ...cue.path] : [cue.at];
  const [x, y] = points.length === 1 ? points[0] : pointAlong(points, ease.inOut(local / (cue.travel ?? 2)));
  let scale = points.length === 1 ? Math.max(ease.backOut(local / 0.5), 0.01) : 1;
  let rotate = 0;
  if (cue.motion === "pulse") scale *= 1 + 0.05 * Math.sin(local * 5);
  if (cue.motion === "wiggle") rotate = Math.sin(local * 7) * 5;
  const half = ([...cue.text].length * size) / 2;
  const strike = cue.strike === undefined ? 0 : ease.inOut((local - cue.strike) / 0.45);
  return (
    <g transform={`translate(${x} ${y})`} opacity={ctx.alpha}>
      <g transform={`rotate(${rotate}) scale(${scale})`}>
        <text
          className="film-glyph" y={size * glyphNudge} fontSize={size} textAnchor="middle" dominantBaseline="central"
          fill={cue.color ?? ink} style={{ fontFamily: fontFamily[cue.font ?? "kai"] }} opacity={strike > 0 ? 1 - 0.45 * strike : 1}
        >
          {cue.text}
        </text>
        {strike > 0 && <line x1={-half * 1.05} y1={0} x2={-half * 1.05 + half * 2.1 * strike} y2={0} stroke={accent} strokeWidth={Math.max(size * 0.07, 8)} strokeLinecap="round" />}
      </g>
      {cue.caption && <text className="film-text" y={size * 0.62 + 22 * ctx.ui} fontSize={30 * ctx.ui} textAnchor="middle" dominantBaseline="central" fill="#7a6a55">{cue.caption}</text>}
    </g>
  );
}

/** 气泡框中心和宽高（画面坐标），检查器也用同样的算法 */
export function bubbleBox(cue: Extract<Cue, { kind: "bubble" }>, ui: number): { center: Vec; width: number; height: number } {
  const size = { s: 34, m: 46, l: 62 }[cue.size ?? "m"] * ui;
  const subSize = 26 * ui;
  const width = Math.max(textWidth(cue.text, size), cue.sub ? textWidth(cue.sub, subSize) : 0) + 48 * ui;
  const height = size + (cue.sub ? subSize + 10 * ui : 0) + 34 * ui;
  const gap = 46 * ui;
  const [ax, ay] = cue.at;
  const side = cue.side ?? "top";
  const center: Vec =
    side === "top" ? [ax, ay - gap - height / 2]
      : side === "bottom" ? [ax, ay + gap + height / 2]
        : side === "left" ? [ax - gap - width / 2, ay] : [ax + gap + width / 2, ay];
  return { center, width, height };
}

function Bubble({ cue, ctx }: { cue: Extract<Cue, { kind: "bubble" }>; ctx: Ctx }) {
  const { ui, k } = ctx;
  const size = { s: 34, m: 46, l: 62 }[cue.size ?? "m"] * ui;
  const subSize = 26 * ui;
  const box = bubbleBox(cue, ui);
  const [cx, cy] = keepInside(box.center, box.width / 2, box.height / 2, ctx);
  const { width, height } = box;
  const [ax, ay] = cue.at;
  const color = cue.color ?? "#ff9f43";
  const pop = Math.max(ease.backOut((ctx.t - cue.from) / 0.5), 0.01);
  // 尾巴从气泡边上朝说话的人伸过去
  const side = cue.side ?? "top";
  const base = 22 * ui;
  const edge: Vec = side === "top" ? [cx, cy + height / 2] : side === "bottom" ? [cx, cy - height / 2] : side === "left" ? [cx + width / 2, cy] : [cx - width / 2, cy];
  const across: Vec = side === "top" || side === "bottom" ? [base, 0] : [0, base];
  const tip: Vec = [edge[0] + (ax - edge[0]) * 0.8, edge[1] + (ay - edge[1]) * 0.8];
  const tail = [[edge[0] - across[0], edge[1] - across[1]], tip, [edge[0] + across[0], edge[1] + across[1]]] as Vec[];
  const textY = cue.sub ? -(subSize + 10 * ui) / 2 : 0;
  return (
    <g opacity={ctx.alpha} transform={`translate(${cx} ${cy}) scale(${pop}) translate(${-cx} ${-cy})`}>
      <rect x={cx - width / 2} y={cy - height / 2} width={width} height={height} rx={Math.min(height / 2, 34 * ui)} fill="#fff" stroke={color} strokeWidth={4 * k} />
      <polygon points={polyline(tail)} fill="#fff" stroke={color} strokeWidth={4 * k} strokeLinejoin="round" />
      <line x1={tail[0][0]} y1={tail[0][1]} x2={tail[2][0]} y2={tail[2][1]} stroke="#fff" strokeWidth={7 * k} />
      <text x={cx} y={cy + textY + size * glyphNudge} fontSize={size} fontWeight={700} textAnchor="middle" dominantBaseline="central" fill={ink} style={{ fontFamily: fontFamily.kai }}>{cue.text}</text>
      {cue.sub && <text className="film-text" x={cx} y={cy + size / 2 + 2 * ui} fontSize={subSize} textAnchor="middle" dominantBaseline="central" fill="#8b7a5c">{cue.sub}</text>}
    </g>
  );
}

function Pin({ cue, ctx }: { cue: Extract<Cue, { kind: "pin" }>; ctx: Ctx }) {
  const { k, ui } = ctx;
  const [x, y] = cue.at;
  const local = ctx.t - cue.from;
  const drop = (1 - ease.backOut(local / 0.55)) * -70 * k;
  const color = cue.color ?? accent;
  const r = 18 * k;
  const side = cue.side ?? "right";
  const size = 30 * ui;
  const offset: Record<string, Vec> = { right: [r + 10 * ui, -r * 1.6], left: [-r - 10 * ui, -r * 1.6], top: [0, -r * 3.6 - size / 2], bottom: [0, size * 0.9] };
  const anchor = side === "right" ? "start" : side === "left" ? "end" : "middle";
  return (
    <g opacity={ctx.alpha}>
      <ellipse cx={x} cy={y} rx={12 * k} ry={5 * k} fill="#000" opacity={0.18} />
      <g transform={`translate(${x} ${y + drop})`}>
        <path d={`M0 0 C ${-r * 0.4} ${-r * 1.2} ${-r * 1.3} ${-r * 1.5} ${-r * 1.3} ${-r * 2.4} A ${r * 1.3} ${r * 1.3} 0 1 1 ${r * 1.3} ${-r * 2.4} C ${r * 1.3} ${-r * 1.5} ${r * 0.4} ${-r * 1.2} 0 0 Z`} fill={color} stroke="#fff" strokeWidth={3 * k} />
        <circle cx={0} cy={-r * 2.4} r={r * 0.5} fill="#fff" />
      </g>
      {cue.text && (
        <text className="film-text" x={x + offset[side][0]} y={y + offset[side][1]} fontSize={size} textAnchor={anchor} dominantBaseline="central" fill={ink}
          opacity={smooth((local - 0.3) / 0.3)}>{cue.text}</text>
      )}
    </g>
  );
}

function Tone({ cue, ctx }: { cue: Extract<Cue, { kind: "tone" }>; ctx: Ctx }) {
  const points = tonePoints(cue.levels, cue.span);
  const progress = ease.inOut((ctx.t - cue.from) / (cue.draw ?? 1.2));
  const drawn = partialPath(points, Math.max(progress, 0.001));
  const tip = drawn[drawn.length - 1];
  const color = cue.color ?? "#8e6ae8";
  const top = Math.min(...points.map(([, y]) => y));
  const mid = (cue.span[0] + cue.span[1]) / 2;
  return (
    <g opacity={ctx.alpha}>
      <polyline points={polyline(drawn)} fill="none" stroke="#fff" strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" />
      <polyline points={polyline(drawn)} fill="none" stroke={color} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={tip[0]} cy={tip[1]} r={16} fill={color} stroke="#fff" strokeWidth={5} />
      {cue.text && (
        <text className="film-text" x={mid} y={top - 56} fontSize={44 * ctx.ui} textAnchor="middle" dominantBaseline="central" fill={ink} style={{ fontFamily: mixedFamily }}>{cue.text}</text>
      )}
      <text className="film-text" x={mid} y={toneChart.bottom + 70} fontSize={30 * ctx.ui} textAnchor="middle" dominantBaseline="central" fill={color}>{cue.levels.join("")}</text>
    </g>
  );
}

function BigText({ cue, ctx }: { cue: Extract<Cue, { kind: "text" }>; ctx: Ctx }) {
  const size = { s: 34, m: 48, l: 72 }[cue.size ?? "m"] * captionScale(ctx);
  const chars = [...cue.text];
  const [x, y] = keepInside(captionPoint(cue.at, ctx), textWidth(cue.text, size) / 2, size / 2, ctx);
  return (
    <text className="film-text film-big" x={x} y={y} fontSize={size} textAnchor="middle" dominantBaseline="central" fill={cue.color ?? ink} opacity={ctx.alpha}>
      {chars.map((char, i) => (
        <tspan key={i} opacity={smooth((ctx.t - cue.from - i * 0.05) / 0.15)}>{char}</tspan>
      ))}
    </text>
  );
}

function Count({ cue, ctx }: { cue: Extract<Cue, { kind: "count" }>; ctx: Ctx }) {
  const [x, y] = captionPoint(cue.at, ctx);
  const value = cue.start + (cue.end - cue.start) * ease.inOut((ctx.t - cue.from) / (cue.over ?? 2));
  const { k } = ctx;
  return (
    <g opacity={ctx.alpha} transform={`translate(${x} ${y})`}>
      <rect x={-150 * k} y={-70 * k} width={300 * k} height={140 * k} rx={28 * k} fill="#fff" stroke={ink} strokeWidth={3 * k} />
      <text className="film-text" y={-34 * k} fontSize={Math.min(26 * captionScale(ctx), (270 * k) / [...cue.label].length)} textAnchor="middle" fill="#7a6a55">{cue.label}</text>
      <text className="film-text film-big" y={22 * k} fontSize={58 * k} textAnchor="middle" fill={ink}>
        {Math.round(value)}<tspan fontSize={24 * k}> {cue.unit ?? ""}</tspan>
      </text>
    </g>
  );
}

function Meter({ cue, ctx }: { cue: Extract<Cue, { kind: "meter" }>; ctx: Ctx }) {
  const [x, y] = captionPoint(cue.at, ctx);
  const { k } = ctx;
  const value = cue.start + (cue.end - cue.start) * ease.inOut((ctx.t - cue.from) / (cue.over ?? 2));
  const width = 280 * k;
  return (
    <g opacity={ctx.alpha} transform={`translate(${x - width / 2} ${y})`}>
      <text className="film-text" y={-14 * k} fontSize={Math.min(26 * captionScale(ctx), width / [...cue.label].length)} fill={ink}>{cue.label}</text>
      <rect width={width} height={28 * k} rx={14 * k} fill="#fff" stroke={ink} strokeWidth={3 * k} />
      <rect width={Math.max(width * Math.min(Math.max(value, 0), 1), 0)} height={28 * k} rx={14 * k} fill={cue.color ?? "#4fb6ff"} />
    </g>
  );
}

function renderCue(cue: Cue, ctx: Ctx): ReactNode {
  switch (cue.kind) {
    case "label": return <Label cue={cue} ctx={ctx} />;
    case "highlight": return <Highlight cue={cue} ctx={ctx} />;
    case "pulse": return <Pulse cue={cue} ctx={ctx} />;
    case "flow": return <Flow cue={cue} ctx={ctx} />;
    case "arrow": return <Arrow cue={cue} ctx={ctx} />;
    case "line": return <Line cue={cue} ctx={ctx} />;
    case "sprite": return <Sprite cue={cue} ctx={ctx} />;
    case "shape": return <Shape cue={cue} ctx={ctx} />;
    case "word": return <Word cue={cue} ctx={ctx} />;
    case "bubble": return <Bubble cue={cue} ctx={ctx} />;
    case "pin": return <Pin cue={cue} ctx={ctx} />;
    case "tone": return <Tone cue={cue} ctx={ctx} />;
    case "text": return <BigText cue={cue} ctx={ctx} />;
    case "count": return <Count cue={cue} ctx={ctx} />;
    case "meter": return <Meter cue={cue} ctx={ctx} />;
    case "myth": return null;
  }
}

function Myth({ cue, t }: { cue: Extract<Cue, { kind: "myth" }>; t: number }) {
  const local = t - cue.from;
  const strike = smooth((local - 0.9) / 0.5);
  const right = smooth((local - 1.6) / 0.4);
  return (
    <div className="film-myth" style={{ opacity: envelope(t, cue.from, cue.to) }}>
      <span className="film-myth-wrong" style={{ "--strike": strike } as CSSProperties}>❌ {cue.wrong}</span>
      <span className="film-myth-right" style={{ opacity: right }}>✅ {cue.right}</span>
    </div>
  );
}

type Props = {
  scene: FilmScene;
  /** 这场戏里的时间（秒） */
  t: number;
  isLast: boolean;
  number: number;
};

export function FilmStage({ scene, t, isLast, number }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(comfortableWidth);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width || comfortableWidth));
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);
  const camera = cameraAt(scene.camera, t);
  const k = 1 / camera.zoom;
  const ui = k * Math.min(Math.max(comfortableWidth / stageWidth, 1), maxLegibility);
  const sceneFade = isLast ? 1 : 1 - smooth((t - (scene.duration - 0.3)) / 0.3);

  return (
    <div ref={stageRef} className="film-stage" data-view={scene.view ?? "paper"}>
      <svg viewBox={`${camera.x} ${camera.y} ${camera.width} ${camera.height}`} role="img" aria-label={scene.title}>
        <Backdrop view={scene.view} />
        {scene.cues.map((cue, index) => {
          const alpha = envelope(t, cue.from, cue.to) * sceneFade;
          if (alpha <= 0.001) return null;
          return <g key={index}>{renderCue(cue, { t, k, ui, alpha, camera })}</g>;
        })}
      </svg>
      <span className="film-title"><b>{number}</b><span>{scene.title}</span></span>
      {scene.cues.map((cue, index) => (cue.kind === "myth" && t >= cue.from ? <Myth key={index} cue={cue} t={t} /> : null))}
    </div>
  );
}
