import { familyQuestions } from "./family.ts";
import { funQuestions } from "./fun.ts";
import { soundQuestions } from "./sound.ts";
import { topics, type DialectQuestion, type Topic, type TopicId } from "./types.ts";
import { whyQuestions } from "./why.ts";
import { wordsQuestions } from "./words.ts";

export * from "./types.ts";

/** 新问题只要加进对应主题的文件，就会出现在这里 */
export const dialectQuestions: readonly DialectQuestion[] = [
  ...whyQuestions,
  ...familyQuestions,
  ...soundQuestions,
  ...wordsQuestions,
  ...funQuestions
];

const byOrder = (a: DialectQuestion, b: DialectQuestion) => a.difficulty - b.difficulty;

export function questionsIn(topic: TopicId): DialectQuestion[] {
  return dialectQuestions.filter((question) => question.topic === topic).sort(byOrder);
}

export function questionById(id: string): DialectQuestion | undefined {
  return dialectQuestions.find((question) => question.id === id);
}

export function topicById(id: string): Topic | undefined {
  return topics.find((topic) => topic.id === id);
}

/** 讲到过这个概念的问题，方言地图上「小念问过」用 */
export function questionsAbout(concept: string): DialectQuestion[] {
  return dialectQuestions.filter((question) => question.concepts?.includes(concept));
}

/** 同一主题里排在后面的问题，用作“小念还想问” */
export function nextQuestions(question: DialectQuestion, count = 3): DialectQuestion[] {
  const list = questionsIn(question.topic).filter((item) => item.id !== question.id);
  const after = list.filter((item) => item.difficulty >= question.difficulty);
  return [...after, ...list.filter((item) => !after.includes(item))].slice(0, count);
}
