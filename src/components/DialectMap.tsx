import type { KeyboardEvent } from "react";
import { familyColor, type Dialect } from "../lib/atlas";
import { fontFamily } from "../lib/fonts";
import { geo, type Point } from "../lib/geo";
import { MapBackdrop } from "./MapBackdrop";
import "./DialectMap.css";

/** 气泡相对方言点挪多远，避开东南沿海挤在一起的几个点 */
const pillOffset: Readonly<Record<string, Point>> = {
  beijinghua: [-10, -108],
  dongbeihua: [-110, 40],
  taiyuanhua: [-105, -88],
  jinanhua: [135, -45],
  xianhua: [-15, -72],
  "lanyin-guanhua": [-20, -82],
  "xinan-guanhua": [-40, 84],
  wuhanhua: [-85, -50],
  nanjinghua: [-58, -74],
  changshahua: [-125, -18],
  nanchanghua: [36, 52],
  suzhouhua: [115, -82],
  shanghaihua: [145, 8],
  wenzhouhua: [125, 0],
  guangzhouhua: [-165, 16],
  "hongkong-cantonese": [-10, 78],
  chaoshanhua: [125, 68],
  hakkahua: [-135, -42],
  "fujian-minnan": [145, -10]
};

export type MapMark = "right" | "wrong" | "option";

type Props = {
  dialects: readonly Dialect[];
  /** 每个方言点气泡里写什么；不写就写方言名 */
  pillText?: (dialect: Dialect) => string | undefined;
  selected?: string;
  /** 只亮这个方言大区，别的变淡 */
  family?: string;
  /** 游戏里标对错；写了 marks 就只画被标出来的点 */
  marks?: Readonly<Record<string, MapMark>>;
  onSelect?: (slug: string) => void;
  label: string;
};

export function DialectMap({ dialects, pillText, selected, family, marks, onSelect, label }: Props) {
  const rank = (dialect: Dialect) => {
    if (selected === dialect.slug || marks?.[dialect.slug] === "right") return 2;
    if (marks?.[dialect.slug] === "wrong") return 1;
    if (family !== undefined && dialect.family_slug !== family) return -1;
    return 0;
  };
  const shown = [...(marks ? dialects.filter((dialect) => marks[dialect.slug]) : dialects)].sort((a, b) => rank(a) - rank(b));
  const press = (slug: string) => (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(slug);
    }
  };
  return (
    <svg className="dialect-map" viewBox="205 15 950 905" role="group" aria-label={label}>
      <rect x={0} y={0} width={1200} height={950} fill="#c4e2f5" pointerEvents="none" />
      <MapBackdrop labels={!marks} />
      {shown.map((dialect) => {
        const [x, y] = geo(dialect.point.lon, dialect.point.lat);
        const color = familyColor[dialect.family_slug] ?? "#888";
        const mark = marks?.[dialect.slug];
        const dim = family !== undefined && dialect.family_slug !== family;
        const on = selected === dialect.slug;
        const [dx, dy] = pillOffset[dialect.slug] ?? [0, -70];
        const text = marks ? dialect.point.name.replace(/（.*）/, "") : pillText ? pillText(dialect) : dialect.name;
        const big = Boolean(pillText) && !marks;
        const place = big ? dialect.point.name.replace(/（.*）/, "") : undefined;
        const size = big ? 40 : 26;
        const chars = [...(text ?? "")].length;
        const width = Math.max(chars * size, place ? [...place].length * 20 : 0) + 30;
        const height = size + (place ? 24 : 0) + 18;
        const [px, py] = [x + dx, y + dy];
        const classes = ["map-point", dim ? "is-dim" : "", on ? "is-on" : "", mark ? `is-${mark}` : ""].filter(Boolean).join(" ");
        return (
          <g key={dialect.slug} className={classes} style={{ color }}
            role={onSelect ? "button" : undefined} tabIndex={onSelect ? 0 : undefined}
            aria-label={`${dialect.name}${text && text !== dialect.name ? `：${text}` : ""}`} aria-pressed={onSelect ? on : undefined}
            onClick={onSelect ? () => onSelect(dialect.slug) : undefined} onKeyDown={onSelect ? press(dialect.slug) : undefined}>
            {text && (
              <>
                <line x1={x} y1={y} x2={px} y2={py} stroke="transparent" strokeWidth={24} />
                <line x1={x} y1={y} x2={px} y2={py} stroke={color} strokeWidth={3} strokeDasharray="6 5" />
                <g className="map-pill">
                  <rect x={px - width / 2} y={py - height / 2} width={width} height={height} rx={Math.min(height / 2, 24)} fill="#fff" stroke={color} strokeWidth={on ? 6 : 3.5} />
                  <text x={px} y={py - (place ? 11 : 0)} fontSize={size} fontWeight={700} textAnchor="middle" dominantBaseline="central" fill="#4a3b2a"
                    style={big ? { fontFamily: fontFamily.kai } : undefined}>{text}</text>
                  {place && <text x={px} y={py + size / 2 + 2} fontSize={19} fontWeight={700} textAnchor="middle" dominantBaseline="central" fill={color}>{place}</text>}
                </g>
              </>
            )}
            {on && <circle className="map-ring" cx={x} cy={y} r={24} fill="none" stroke={color} strokeWidth={5} />}
            <circle cx={x} cy={y} r={on ? 16 : 12} fill={mark === "wrong" ? "#bbb" : color} stroke="#fff" strokeWidth={4} />
            {mark === "right" && <text x={x} y={y - 34} fontSize={34} textAnchor="middle" dominantBaseline="central">✅</text>}
            {mark === "wrong" && <text x={x} y={y - 34} fontSize={30} textAnchor="middle" dominantBaseline="central">❌</text>}
          </g>
        );
      })}
    </svg>
  );
}
