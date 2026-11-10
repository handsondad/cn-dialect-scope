// 方言知识库（data/ 下的 JSON）的类型和纯函数。网页通过 src/data/atlas.ts 读数据，
// 测试直接读 JSON 文件再调这里的函数，所以这里不碰 Vite 专有的东西。
import type { SampleVoiceId } from "./samples.ts";
import { dialectVoice } from "./samples.ts";

export type Confidence = "high" | "medium" | "unverified";

export type Family = {
  readonly slug: string;
  readonly name: string;
  readonly english_name: string;
  readonly summary: string;
  readonly regions: readonly string[];
  readonly learning_focus: readonly string[];
};

export type Dialect = {
  readonly slug: string;
  readonly order: number;
  readonly name: string;
  readonly region: string;
  readonly dialect_family: string;
  readonly family_slug: string;
  readonly overview: string;
  readonly classification: { readonly path: readonly string[]; readonly confidence: Confidence };
  readonly point: { readonly name: string; readonly province: string; readonly lat: number; readonly lon: number };
  readonly vocabulary: readonly { readonly term: string; readonly description: string; readonly example?: string }[];
  readonly grammar_features: readonly { readonly name: string; readonly description: string; readonly example?: string }[];
  readonly phonological_features: readonly { readonly name: string; readonly description: string; readonly example?: string }[];
  readonly expressions: readonly { readonly text: string; readonly meaning: string }[];
};

export type Expression = {
  readonly dialect: string;
  readonly form: string;
  readonly orthography: string;
  readonly etymon?: string;
  readonly romanization?: { readonly scheme: string; readonly text: string };
  readonly example?: string;
  readonly example_gloss?: string;
  readonly register: string;
  readonly status: string;
  readonly confidence: Confidence;
  readonly note?: string;
};

export type Concept = {
  readonly slug: string;
  readonly headword: string;
  readonly gloss: string;
  readonly category: string;
  readonly aliases: readonly string[];
  readonly etymology?: readonly { readonly character: string; readonly note: string; readonly confidence: Confidence }[];
  readonly expressions: readonly Expression[];
};

export type KbTopic = {
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly body: readonly string[];
  readonly concepts: readonly string[];
  readonly confidence: Confidence;
};

export type Atlas = {
  readonly families: readonly Family[];
  readonly dialects: readonly Dialect[];
  readonly concepts: readonly Concept[];
  readonly topics: readonly KbTopic[];
};

/** 地图上每个方言大区的颜色 */
export const familyColor: Readonly<Record<string, string>> = {
  mandarin: "#f39c34",
  jin: "#c77d2e",
  wu: "#3d9be9",
  xiang: "#e8578a",
  gan: "#8e6ae8",
  hakka: "#2fae6a",
  cantonese: "#e5483b",
  minnan: "#13a99a"
};

export const confidenceLabel: Record<Confidence, string> = { high: "大家都这么说", medium: "还要再核对", unverified: "还不确定" };

/** 一个概念在每个方言点的说法（一个方言点可能有几种说法） */
export function formsByDialect(concept: Concept): Map<string, Expression[]> {
  const out = new Map<string, Expression[]>();
  for (const item of concept.expressions) out.set(item.dialect, [...(out.get(item.dialect) ?? []), item]);
  return out;
}

/** 某个方言点会说的词：高频词、概念里的说法、常用表达 */
function wordsOf(atlas: Atlas, dialect: Dialect): string[] {
  const forms = atlas.concepts.flatMap((concept) => concept.expressions.filter((item) => item.dialect === dialect.slug).map((item) => item.form));
  return [...dialect.vocabulary.map((item) => item.term), ...forms, ...dialect.expressions.map((item) => item.text)];
}

/** 种子相同，抽出来的题就相同（mulberry32） */
export function seeded(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export type QuizRound = {
  /** 屏幕上的方言句子 */
  readonly prompt: string;
  /** 句子里露馅的那个词 */
  readonly clue: string;
  /** 这个词是什么意思 */
  readonly hint: string;
  readonly answer: string;
  readonly options: readonly string[];
  readonly voice?: SampleVoiceId;
};

/**
 * 「猜猜是哪里话」：从方言点的高频词例句和常用表达里抽题。
 * 干扰项来自别的方言大区，而且自己不会说这句话里的那个词，免得出现两个都对的选项。
 */
export function makeQuiz(atlas: Atlas, seed: number, count = 8): QuizRound[] {
  const random = seeded(seed);
  const candidates: { prompt: string; clue: string; hint: string; dialect: Dialect }[] = [];
  for (const dialect of atlas.dialects) {
    for (const item of dialect.vocabulary) {
      if (item.example) candidates.push({ prompt: item.example, clue: item.term, hint: item.description, dialect });
    }
    for (const item of dialect.expressions) candidates.push({ prompt: item.text, clue: item.text, hint: item.meaning, dialect });
  }

  const words = new Map(atlas.dialects.map((dialect) => [dialect.slug, wordsOf(atlas, dialect)]));
  const rounds: QuizRound[] = [];
  const usedPrompts = new Set<string>();
  const perFamily = new Map<string, number>();
  const cap = Math.ceil(count / 4);
  for (const candidate of shuffle(candidates, random)) {
    if (rounds.length >= count) break;
    const { dialect } = candidate;
    if (usedPrompts.has(candidate.prompt) || (perFamily.get(dialect.family_slug) ?? 0) >= cap) continue;
    const others = atlas.dialects.filter((other) => {
      if (other.family_slug === dialect.family_slug) return false;
      const theirs = words.get(other.slug) ?? [];
      return !theirs.includes(candidate.clue) && !theirs.some((word) => [...word].length > 1 && candidate.prompt.includes(word));
    });
    const decoys: Dialect[] = [];
    for (const other of shuffle(others, random)) {
      if (decoys.length === 2) break;
      if (decoys.some((picked) => picked.family_slug === other.family_slug)) continue;
      decoys.push(other);
    }
    if (decoys.length < 2) continue;
    usedPrompts.add(candidate.prompt);
    perFamily.set(dialect.family_slug, (perFamily.get(dialect.family_slug) ?? 0) + 1);
    rounds.push({
      prompt: candidate.prompt,
      clue: candidate.clue,
      hint: candidate.hint,
      answer: dialect.slug,
      options: shuffle([dialect.slug, ...decoys.map((item) => item.slug)], random),
      voice: dialectVoice[dialect.slug]
    });
  }
  return rounds;
}
