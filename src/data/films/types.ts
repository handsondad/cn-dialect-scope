/**
 * 讲解动画：每个问题一部短片，由几场戏组成，每场戏配对话里的一轮问答。
 *
 * 画面坐标是 1200×900，坐标都写成 [x, y]。底图是画出来的：纸、示意地图、声调格。
 * 一场戏里的每个元素都只由时间 t 决定，所以能暂停、拖动、从任意一帧开始看。
 */

/** paper 暖色纸面（默认）、map 示意地图（海岸线、长江、黄河）、tones 五度声调格 */
export type ViewId = "paper" | "map" | "tones";

export type Point = readonly [number, number];

/** 字体：kai 毛笔楷书（默认），song 印刷体。方言字（冇、佢、咗）楷书里没有时会自动退回系统字体 */
export type Font = "kai" | "song";

type Timed = {
  /** 出现的时间（秒，从这场戏开头算） */
  readonly from: number;
  /** 消失的时间，不写就留到这场戏结束 */
  readonly to?: number;
};

export type Cue = Timed &
  (
    /** 贴在某处的标签，带一根引线；pos 是标签放的位置，不写就放在 side 那一边 */
    | { readonly kind: "label"; readonly at: Point; readonly text: string; readonly pos?: Point; readonly side?: "left" | "right" | "top" | "bottom"; readonly color?: string }
    /** 一圈柔光，把注意力引到一块地方上；size 是这块地方的宽高 */
    | { readonly kind: "highlight"; readonly at: Point; readonly size?: readonly [number, number]; readonly color?: string }
    /** 一圈圈往外扩的波纹：声音、提醒 */
    | { readonly kind: "pulse"; readonly at: Point; readonly color?: string; readonly radius?: number; readonly rate?: number }
    /** 一串小点（或小图标）沿路线一直流动：传过去的话、搬家的人 */
    | { readonly kind: "flow"; readonly path: readonly Point[]; readonly color?: string; readonly icon?: string; readonly count?: number; readonly speed?: number; readonly size?: number }
    /** 一笔画出来的箭头，可以带一句话 */
    | { readonly kind: "arrow"; readonly path: readonly Point[]; readonly color?: string; readonly text?: string; readonly draw?: number }
    /** 一笔画出来的线，没有箭头：分界、记号 */
    | { readonly kind: "line"; readonly path: readonly Point[]; readonly color?: string; readonly width?: number; readonly draw?: number; readonly dashed?: boolean }
    /**
     * 一个表情图标：一个点就原地弹出来，几个点就沿路线走一趟（用 travel 秒）。
     * rotate 是一开始转的角度（度），写了 turnTo 就在 over 秒里转到那个角度。
     */
    | {
        readonly kind: "sprite";
        readonly icon: string;
        readonly path: readonly Point[];
        readonly size?: number;
        readonly travel?: number;
        readonly spin?: boolean;
        readonly wobble?: boolean;
        readonly rotate?: number;
        readonly turnTo?: number;
        readonly over?: number;
      }
    /** 示意图形：方框、圆、胶囊，可以写字 */
    | {
        readonly kind: "shape";
        readonly shape: "circle" | "rect" | "pill";
        readonly at: Point;
        readonly size: readonly [number, number];
        readonly color: string;
        readonly text?: string;
        readonly motion?: "pulse" | "wiggle" | "grow" | "shrink";
        /** grow / shrink 用几秒变完，默认 2 */
        readonly over?: number;
        /** 加一圈虚线边，里面照样用 color 填；只要框不要底色就把 color 写成 "none" */
        readonly outline?: boolean;
      }
    /**
     * 一个字或一个词（1～6 个字）。size 是字的大小（默认 200）；caption 是下面的小字（读音、意思）。
     * 写了 path 就沿路线挪过去（用 travel 秒）。strike 是出现后第几秒用红线划掉。
     */
    | {
        readonly kind: "word";
        readonly text: string;
        readonly at: Point;
        readonly font?: Font;
        readonly size?: number;
        readonly color?: string;
        readonly caption?: string;
        readonly path?: readonly Point[];
        readonly travel?: number;
        readonly strike?: number;
        readonly motion?: "pulse" | "wiggle";
      }
    /**
     * 说话气泡：at 是说话的人（气泡尾巴指着的地方），气泡放在 side 那一边（默认 top）。
     * text 是说的话，sub 是下面一行小字：拼音、粤拼，或者普通话意思。
     */
    | {
        readonly kind: "bubble";
        readonly at: Point;
        readonly text: string;
        readonly sub?: string;
        readonly side?: "top" | "bottom" | "left" | "right";
        readonly size?: "s" | "m" | "l";
        readonly color?: string;
      }
    /** 地图上的图钉，从上面落下来；text 是地名，写在图钉旁边 */
    | { readonly kind: "pin"; readonly at: Point; readonly text?: string; readonly color?: string; readonly side?: "left" | "right" | "top" | "bottom" }
    /**
     * 声调曲线（配 tones 底图）：levels 是五度标记，比如普通话第三声 [2, 1, 4]，粤语第一声 [5, 5]。
     * span 是曲线横跨的 x 范围，text 是写在曲线上方的字（"妈 mā"），draw 是画几秒。
     */
    | { readonly kind: "tone"; readonly levels: readonly number[]; readonly span: readonly [number, number]; readonly text?: string; readonly color?: string; readonly draw?: number }
    /**
     * 一行大字，用来点出关键词。text、count、meter 是字幕性质的：坐标指的是
     * 镜头里看到的屏幕位置（同样按 1200×900），镜头怎么推拉都留在原处。
     */
    | { readonly kind: "text"; readonly at: Point; readonly text: string; readonly size?: "s" | "m" | "l"; readonly color?: string }
    /** 数字从 start 数到 end */
    | { readonly kind: "count"; readonly at: Point; readonly label: string; readonly start: number; readonly end: number; readonly unit?: string; readonly over?: number }
    /** 一根进度条，从 start 涨（或落）到 end，取值 0～1 */
    | { readonly kind: "meter"; readonly at: Point; readonly label: string; readonly start: number; readonly end: number; readonly color?: string; readonly over?: number }
    /** 常见误会：先写错误的说法再划掉，然后换成正确的说法 */
    | { readonly kind: "myth"; readonly wrong: string; readonly right: string }
  );

/** 镜头：在 t 秒时对准 at，放大 zoom 倍；两个关键帧之间平滑推拉 */
export type CameraKey = { readonly t: number; readonly at: Point; readonly zoom: number };

export type FilmScene = {
  /** 配对话里第几轮（从 0 数） */
  readonly turn: number;
  /** 这场戏的小标题，不超过 12 个字 */
  readonly title: string;
  /** 底图，不写就是纸面 */
  readonly view?: ViewId;
  readonly camera?: readonly CameraKey[];
  /** 秒 */
  readonly duration: number;
  readonly cues: readonly Cue[];
};

export type Film = {
  readonly question: string;
  readonly scenes: readonly FilmScene[];
};
