import type { Atlas, Concept, Dialect, Family, KbTopic } from "../lib/atlas";
import families from "../../data/families.json";
import topics from "../../data/topics.json";

/** data/ 下的方言知识库，和 Python 工具共用同一份 JSON */
const dialectFiles = import.meta.glob<Dialect>("../../data/dialects/*.json", { eager: true, import: "default" });
const conceptFiles = import.meta.glob<Concept>("../../data/concepts/*.json", { eager: true, import: "default" });

export const atlas: Atlas = {
  families: families as unknown as Family[],
  dialects: Object.values(dialectFiles).sort((a, b) => a.order - b.order),
  concepts: Object.values(conceptFiles).sort((a, b) => a.category.localeCompare(b.category, "zh") || a.slug.localeCompare(b.slug)),
  topics: topics as unknown as KbTopic[]
};

export const dialectBySlug = (slug: string) => atlas.dialects.find((dialect) => dialect.slug === slug);
export const conceptBySlug = (slug: string) => atlas.concepts.find((concept) => concept.slug === slug);
export const familyBySlug = (slug: string) => atlas.families.find((family) => family.slug === slug);
