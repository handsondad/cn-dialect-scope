// 「听一听」：用电脑合成的方言音色读一句方言。只有粤语和东北话有合适的音色，其他方言只显示拼音。
// 音频由 `npm run voice` 生成到 public/voice/say/，这里只算文件名，浏览器和生成脚本共用。

export type SampleVoiceId = "yue" | "dongbei" | "putonghua";

export const sampleVoices: Record<SampleVoiceId, { readonly voice: string; readonly rate: string; readonly label: string }> = {
  yue: { voice: "zh-HK-HiuMaanNeural", rate: "-10%", label: "粤语" },
  dongbei: { voice: "zh-CN-liaoning-XiaobeiNeural", rate: "+0%", label: "东北话" },
  putonghua: { voice: "zh-CN-XiaoxiaoNeural", rate: "-10%", label: "普通话" }
};

/** 方言点 → 用哪个音色读它的词；没有的方言点不出「听一听」按钮 */
export const dialectVoice: Readonly<Record<string, SampleVoiceId>> = {
  guangzhouhua: "yue",
  "hongkong-cantonese": "yue",
  dongbeihua: "dongbei"
};

/** FNV-1a：浏览器里同步就能算，文字或音色一改，文件名就跟着变 */
function fnv1a(text: string): string {
  let hash = 0x811c9dc5;
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    hash ^= code;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}

export function sampleKey(voice: SampleVoiceId, text: string): string {
  const { voice: name, rate } = sampleVoices[voice];
  return `${voice}-${fnv1a(`${name}|${rate}|${text}`)}`;
}

export type Sample = { readonly voice: SampleVoiceId; readonly text: string };

type SayShow = { readonly kind: string; readonly lines?: readonly { readonly voice?: SampleVoiceId; readonly text: string }[] };
type QuestionLike = { readonly dialogue: readonly { readonly show?: SayShow }[] };
type DialectLike = {
  readonly slug: string;
  readonly vocabulary: readonly { readonly term: string; readonly example?: string }[];
  readonly expressions: readonly { readonly text: string }[];
};
type ConceptLike = { readonly expressions: readonly { readonly dialect: string; readonly form: string; readonly example?: string }[] };

/** 网站上所有「听一听」要用的句子：问答里的 say、地图上的方言词和例句、游戏里的句子 */
export function collectSamples(questions: readonly QuestionLike[], dialects: readonly DialectLike[], concepts: readonly ConceptLike[]): Sample[] {
  const found = new Map<string, Sample>();
  const add = (voice: SampleVoiceId | undefined, text: string | undefined) => {
    if (!voice || !text) return;
    found.set(sampleKey(voice, text), { voice, text });
  };
  for (const question of questions) {
    for (const turn of question.dialogue) {
      if (turn.show?.kind === "say") for (const line of turn.show.lines ?? []) add(line.voice, line.text);
    }
  }
  for (const dialect of dialects) {
    const voice = dialectVoice[dialect.slug];
    for (const item of dialect.vocabulary) { add(voice, item.term); add(voice, item.example); }
    for (const item of dialect.expressions) add(voice, item.text);
  }
  for (const concept of concepts) {
    for (const item of concept.expressions) {
      const voice = dialectVoice[item.dialect];
      add(voice, item.form);
      add(voice, item.example);
    }
  }
  return [...found.values()];
}
