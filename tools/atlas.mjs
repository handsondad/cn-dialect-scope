// 在 Node 里读 data/ 下的方言知识库，排序和 src/data/atlas.ts 一样。浏览器那边用 import.meta.glob。
import { readdirSync, readFileSync } from "node:fs";

const dataDir = new URL("../data/", import.meta.url);
const readJson = (url) => JSON.parse(readFileSync(url, "utf8"));
const readFolder = (name) =>
  readdirSync(new URL(`${name}/`, dataDir))
    .filter((file) => file.endsWith(".json"))
    .map((file) => readJson(new URL(`${name}/${file}`, dataDir)));

export function readAtlas() {
  return {
    families: readJson(new URL("families.json", dataDir)),
    dialects: readFolder("dialects").sort((a, b) => a.order - b.order),
    concepts: readFolder("concepts").sort((a, b) => a.category.localeCompare(b.category, "zh") || a.slug.localeCompare(b.slug)),
    topics: readJson(new URL("topics.json", dataDir))
  };
}
