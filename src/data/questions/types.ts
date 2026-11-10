import type { SampleVoiceId } from "../../lib/samples.ts";

/**
 * 小念 × 爸爸：问题驱动的讲解。
 * 小念从听到的一句方言发问，爸爸回答；小念接着爸爸刚说的话追问，一问一答一路讲到道理。
 * 从头读到尾，就能弄懂标题里的那个问题。
 */

export type TopicId = "why" | "family" | "sound" | "words" | "fun";

export type Topic = {
  id: TopicId;
  emoji: string;
  title: string;
  color: string;
  /** 小念眼里这一类是什么 */
  kidHook: string;
  /** 爸爸眼里这一类在讲什么 */
  dadLens: string;
};

export const topics: readonly Topic[] = [
  {
    id: "why", emoji: "🧭", title: "为什么说话不一样", color: "#ff9f43",
    kidHook: "外婆说的话我怎么听不懂？普通话又是从哪来的？",
    dadLens: "方言是怎么来的：人们分开住久了，说话就慢慢变得不一样"
  },
  {
    id: "family", emoji: "🌳", title: "方言大家族", color: "#2fae6a",
    kidHook: "中国有多少种方言？四川话我怎么能听懂一大半？",
    dadLens: "汉语方言的分区：官话、吴语、粤语、闽语、客家话、湘语、赣语……"
  },
  {
    id: "sound", emoji: "🎵", title: "声调的秘密", color: "#8e6ae8",
    kidHook: "妈、麻、马、骂怎么读得不一样？粤语有九个声调？",
    dadLens: "声调：声音的高低升降，各地的声调数目和走向都不一样"
  },
  {
    id: "words", emoji: "💬", title: "一个意思各地说", color: "#3d9be9",
    kidHook: "广东人说「冇」，福建人说「无」；外婆到底该叫什么？",
    dadLens: "同一个意思，各地用不同的词，背后常常藏着古汉语"
  },
  {
    id: "fun", emoji: "🎲", title: "好玩的方言", color: "#e5483b",
    kidHook: "东北话「嘎哈」是啥？上海人为什么叫「侬」？",
    dadLens: "各地最有味道的词：一个字在不同地方、不同年代意思会跑"
  }
];

/** 问题列表里从简单到复杂的排序 */
export type Difficulty = 1 | 2 | 3;
export const difficultyLabel: Record<Difficulty, string> = { 1: "入门", 2: "进阶", 3: "挑战" };

export type ShowFrame = { icon: string; label: string };

/** 「听一听」里的一句：voice 是用哪个合成音色读（没有就只显示文字），label 是哪里话，sub 是读音或意思 */
export type SayLine = { readonly text: string; readonly label: string; readonly voice?: SampleVoiceId; readonly sub?: string };

/**
 * 爸爸讲这一段时配的东西：图解步骤、可以点着听的方言句子、图片或视频。
 * 图片的 credit 显示在图下面：作者、许可、来源，和 THIRD_PARTY_NOTICES.md 里写的一致。
 */
export type BeatShow =
  | { kind: "steps"; frames: readonly ShowFrame[] }
  | { kind: "say"; lines: readonly SayLine[] }
  | { kind: "image"; src: string; alt: string; caption: string; credit: string }
  | { kind: "video"; src: string; alt: string; poster?: string };

export type DialogueTurn = {
  /** 小念：第一句说听到的话，之后每一句都接着爸爸上一句里的说法追问；最后一句用自己的话总结 */
  nian: string;
  /** 爸爸的回答 */
  dad: string;
  show?: BeatShow;
};

export type DialectQuestion = {
  id: string;
  topic: TopicId;
  /** 列表上显示的问题，用小念的口吻 */
  title: string;
  /** 小念刚刚遇到的事 */
  trigger: string;
  difficulty: Difficulty;
  /** 这一问讲到的方言词，页面上列出来 */
  words: readonly string[];
  /** 知识库里相关的概念（data/concepts 的 slug），页面上能点进方言地图看各地说法 */
  concepts?: readonly string[];
  /** 一问一答，从听到的话讲到道理 */
  dialogue: readonly DialogueTurn[];
  /** 给大人：补充背景、学界的不同说法、出处 */
  parentTip: string;
};
