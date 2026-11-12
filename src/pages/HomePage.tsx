import { lazy, Suspense, useRef, useState, type CSSProperties } from "react";
import type { LensState, RunLabCue } from "../components/RunLab3D";
import { SayButton } from "../components/SayButton";
import { WebGLBoundary } from "../components/WebGLBoundary";
import { questionsIn, topics, type TopicId } from "../data/questions";
import { useInView } from "../hooks/useInView";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { familyColor } from "../lib/atlas";
import { canUseWebGL, createBodyState } from "../lib/run-lab";
import "../components/RunLab.css";
import "./Questions.css";

const RunLab3D = lazy(() => import("../components/RunLab3D"));

const chats: readonly (readonly [string, string])[] = [
  ["爸爸，外婆说「侬饭吃过了伐」，我一句也没听懂！", "那是上海话。各地都有自己的方言，我们一个一个去听！"],
  ["广东人为什么把「没有」说成「冇」？", "好问题！各地说法不一样，背后常常藏着古汉语。"],
  ["我能自己听听各地怎么说话吗？", "能！点「方言地图」，再玩一局「猜猜哪里话」。"]
];

/** 首页那一排「没有」的各地说法 */
const sampleForms: readonly (readonly [string, string, string])[] = [
  ["没有", "北京", "mandarin"], ["冇", "广州", "cantonese"], ["无", "厦门", "minnan"], ["呒没", "上海", "wu"], ["冇得", "长沙", "xiang"]
];

/** 知识库里东北话「嘎哈」的例句，`npm run voice` 会给它配音 */
const dongbeiSample = "你搁这儿嘎哈呢？";

/** 奇遇记系列的兄弟站点 */
const siblings: readonly (readonly [string, string])[] = [
  ["🚀 身体奇遇记", "https://handsondad.github.io/bodyverse/"],
  ["🧪 化学奇遇记", "https://handsondad.github.io/chemverse/"],
  ["📜 汉字奇遇记", "https://handsondad.github.io/hanverse/"]
];

type Props = {
  heard: readonly string[];
  onTopic: (id: TopicId) => void;
  onMap: () => void;
  onGame: () => void;
};

export function HomePage({ heard, onTopic, onMap, onGame }: Props) {
  const [webgl] = useState(canUseWebGL);
  const reducedMotion = useReducedMotion();
  const [stageRef, inView] = useInView<HTMLDivElement>();
  const [chat, setChat] = useState(0);
  const bodyRef = useRef(createBodyState());
  const lensRef = useRef<LensState>({ on: false, follow: true, x: 0, y: 0, r: 80 });
  const cueRef = useRef<RunLabCue>({ id: 0, clip: "Jump" });

  function talk() {
    cueRef.current = { id: cueRef.current.id + 1, clip: cueRef.current.id % 2 ? "Victory" : "Jump" };
    setChat((chat + 1) % chats.length);
  }

  const [nianLine, dadLine] = chats[chat];
  const flat = <div className="home-planet-flat" aria-hidden="true">👨🧒</div>;

  return (
    <div className="home">
      <header className="home-title">
        <h1><span aria-hidden="true">🗣️</span> 方言奇遇记</h1>
        <p>小念一问，爸爸一答，听听天南地北怎么说话</p>
      </header>

      <section aria-labelledby="home-duo-title">
        <h2 id="home-duo-title" className="home-section-title">小念和爸爸去听各地的话</h2>
        <div ref={stageRef} className="home-planet">
          {webgl ? (
            <WebGLBoundary name="home-planet" fallback={flat}>
              <Suspense fallback={flat}>
                <RunLab3D character="nian" partner="dad" bodyRef={bodyRef} lensRef={lensRef} cueRef={cueRef}
                  reducedMotion={reducedMotion} active={inView} label="爸爸和小念站在小星球上，点他们会接着聊"
                  onCharacterTap={talk} onReady={() => undefined} />
              </Suspense>
            </WebGLBoundary>
          ) : flat}
          <button type="button" className="home-bubble is-nian" onClick={talk}><b>小念</b>{nianLine}</button>
          <button type="button" className="home-bubble is-dad" onClick={talk}><b>爸爸</b>{dadLine}</button>
          <button type="button" className="home-chat-next" onClick={talk} aria-label="换一句对话">💬 换一句 ({chat + 1}/{chats.length})</button>
        </div>
      </section>

      <section aria-labelledby="home-topics-title">
        <h2 id="home-topics-title" className="home-section-title">方言的秘密</h2>
        <div className="home-systems">
          {topics.map((topic) => {
            const list = questionsIn(topic.id);
            const done = list.filter((question) => heard.includes(question.id)).length;
            return (
              <button key={topic.id} type="button" className="system-card" style={{ "--bubble": topic.color } as CSSProperties}
                onClick={() => onTopic(topic.id)}>
                <span className="system-emoji" aria-hidden="true">{topic.emoji}</span>
                <strong>{topic.title}</strong>
                <small>{topic.kidHook}</small>
                <span className="system-count">{list.length} 个问题{done > 0 && ` · ⭐ 听过 ${done}`} →</span>
              </button>
            );
          })}
          <button type="button" className="system-card home-special" style={{ "--bubble": "#3d9be9" } as CSSProperties} onClick={onMap}>
            <span className="system-emoji" aria-hidden="true">🗺️</span>
            <strong>方言地图</strong>
            <small>点一个词，看看「没有」「吃」「外婆」在各地怎么说。</small>
            <span className="home-forms" aria-hidden="true">
              {sampleForms.map(([form, place, family]) => (
                <span key={form} style={{ "--dot": familyColor[family] } as CSSProperties}><b>{form}</b><i>{place}</i></span>
              ))}
            </span>
          </button>
        </div>
        <div className="home-game" style={{ "--bubble": "#e5483b" } as CSSProperties}>
          <button type="button" className="home-game-main" onClick={onGame}>
            <span className="system-emoji" aria-hidden="true">🎯</span>
            <span>
              <strong>猜猜是哪里话</strong>
              <small>读一句、听一句，猜猜它是广州话、上海话还是东北话？</small>
            </span>
            <span className="system-count">开始 →</span>
          </button>
          <span className="home-game-try">
            <small>先听两句：</small>
            <SayButton voice="yue" text="冇问题。" label="粤语" />
            <SayButton voice="dongbei" text={dongbeiSample} label="东北话" />
          </span>
        </div>
      </section>

      <footer className="home-footer">
        <span>奇遇记系列：</span>
        {siblings.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
      </footer>
    </div>
  );
}
