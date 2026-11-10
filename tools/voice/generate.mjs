// 用 edge-tts 配音，只生成新的或改过的句子，可以随时中断再续：
//   · 每一句问答 → public/voice/<问题>/<轮次>-<nian|dad>.mp3
//   · 「听一听」的方言句子（问答里的 say、地图和游戏里的方言词）→ public/voice/say/<音色-指纹>.mp3
// 时长和指纹记在 src/data/voice-manifest.json。
//   npm run voice                    全部
//   npm run voice -- dongbei nong    只配这几个问题的问答（「听一听」照样补齐）
// 需要：python -m pip install edge-tts，以及 PATH 里的 ffmpeg / ffprobe；生成时要联网。
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { dialectQuestions } from "../../src/data/questions/index.ts";
import { collectSamples, sampleKey, sampleVoices } from "../../src/lib/samples.ts";
import { readAtlas } from "../atlas.mjs";
import { clipHash, clipKey, voices } from "./voices.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = join(root, "src/data/voice-manifest.json");
const voiceDir = join(root, "public/voice");
const parallel = 4;

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let out = "";
    let err = "";
    child.stdout.on("data", (chunk) => { out += chunk; });
    child.stderr.on("data", (chunk) => { err += chunk; });
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve(out) : reject(new Error(`${command} 退出码 ${code}: ${err.slice(-400)}`))));
  });
}

const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, "utf8")) : {};
manifest.clips ??= {};
manifest.samples ??= {};

const sortKeys = (record) => Object.fromEntries(Object.entries(record).sort(([a], [b]) => a.localeCompare(b)));

/** Windows 上开发服务器正在读这个文件时改名会报 EPERM，稍等再试 */
function save() {
  const body = { voices, clips: sortKeys(manifest.clips), samples: sortKeys(manifest.samples) };
  writeFileSync(`${manifestPath}.tmp`, `${JSON.stringify(body, null, 1)}\n`);
  for (let attempt = 1; ; attempt += 1) {
    try {
      renameSync(`${manifestPath}.tmp`, manifestPath);
      return;
    } catch (error) {
      if (attempt >= 20 || !["EPERM", "EBUSY", "EACCES"].includes(error.code)) throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50);
    }
  }
}

const only = new Set(process.argv.slice(2));

const wantedClips = new Map();
for (const question of dialectQuestions) {
  question.dialogue.forEach((turn, index) => {
    for (const who of ["nian", "dad"]) wantedClips.set(clipKey(question.id, index, who), { who, text: turn[who], question: question.id });
  });
}

const { dialects, concepts } = readAtlas();
const wantedSamples = new Map(collectSamples(dialectQuestions, dialects, concepts).map((sample) => [sampleKey(sample.voice, sample.text), sample]));

for (const key of Object.keys(manifest.clips)) {
  if (wantedClips.has(key)) continue;
  delete manifest.clips[key];
  rmSync(join(voiceDir, `${key}.mp3`), { force: true });
}
for (const key of Object.keys(manifest.samples)) {
  if (wantedSamples.has(key)) continue;
  delete manifest.samples[key];
  rmSync(join(voiceDir, "say", `${key}.mp3`), { force: true });
}

const clipJobs = [...wantedClips]
  .filter(([key, clip]) => (!only.size || only.has(clip.question)) && (manifest.clips[key]?.hash !== clipHash(clip.who, clip.text) || !existsSync(join(voiceDir, `${key}.mp3`))))
  .map(([key, clip]) => ({ key, ...voices[clip.who], text: clip.text, out: join(voiceDir, `${key}.mp3`), done: (seconds) => { manifest.clips[key] = { hash: clipHash(clip.who, clip.text), seconds }; } }));

const sampleJobs = [...wantedSamples]
  .filter(([key]) => !manifest.samples[key] || !existsSync(join(voiceDir, "say", `${key}.mp3`)))
  .map(([key, sample]) => ({ key: `say/${key}`, ...sampleVoices[sample.voice], text: sample.text, out: join(voiceDir, "say", `${key}.mp3`), done: (seconds) => { manifest.samples[key] = { text: sample.text, seconds }; } }));

const todo = [...clipJobs, ...sampleJobs];
console.log(`需要配音：问答 ${clipJobs.length} 句（一共 ${wantedClips.size} 句），听一听 ${sampleJobs.length} 句（一共 ${wantedSamples.size} 句）`);

const scratch = join(tmpdir(), "dialectverse-voice");
mkdirSync(scratch, { recursive: true });

async function make({ key, voice, rate, text, out, done }) {
  const raw = join(scratch, `${key.replaceAll("/", "_")}.raw.mp3`);
  mkdirSync(dirname(out), { recursive: true });
  for (let attempt = 1; ; attempt += 1) {
    try {
      await run("python", ["-m", "edge_tts", "--voice", voice, `--rate=${rate}`, "--text", text, "--write-media", raw]);
      break;
    } catch (error) {
      if (attempt >= 4) throw error;
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
    }
  }
  await run("ffmpeg", ["-y", "-v", "error", "-i", raw, "-ac", "1", "-ar", "24000", "-b:a", "32k", out]);
  rmSync(raw, { force: true });
  const seconds = Number((await run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out])).trim());
  done(Math.round(seconds * 100) / 100);
}

let finished = 0;
let failed = 0;
const queue = [...todo];
await Promise.all(Array.from({ length: parallel }, async () => {
  for (let job = queue.shift(); job; job = queue.shift()) {
    try {
      await make(job);
      save();
      finished += 1;
      if (finished % 20 === 0 || finished === todo.length) console.log(`${finished}/${todo.length}`);
    } catch (error) {
      failed += 1;
      console.error(`✖ ${job.key}「${job.text}」: ${error.message}`);
    }
  }
}));
save();
console.log(failed ? `完成 ${finished} 句，失败 ${failed} 句，再跑一次会只补失败的` : `全部完成：${finished} 句`);
process.exitCode = failed ? 1 : 0;
