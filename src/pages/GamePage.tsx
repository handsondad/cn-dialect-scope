import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Avatar } from "../components/Avatar";
import { DialectMap, type MapMark } from "../components/DialectMap";
import { SayButton } from "../components/SayButton";
import { atlas, dialectBySlug } from "../data/atlas";
import { familyColor, makeQuiz } from "../lib/atlas";
import { fontFamily } from "../lib/fonts";
import "./Questions.css";
import "./GamePage.css";

const roundCount = 8;

type Props = {
  onBack: () => void;
  backLabel: string;
  onMap: (concept?: string) => void;
};

function cheer(score: number) {
  if (score === roundCount) return "全对！你的耳朵能走遍全中国啦！";
  if (score >= roundCount * 0.6) return "真厉害！再来一局，看看能不能全对？";
  return "方言真的很难猜！去方言地图上逛一逛，下次一定更厉害。";
}

export function GamePage({ onBack, backLabel, onMap }: Props) {
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const rounds = useMemo(() => makeQuiz(atlas, seed, roundCount), [seed]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | undefined>();
  const [score, setScore] = useState(0);
  const done = index >= rounds.length;
  const round = rounds[index];
  const answered = useRef(false);
  const nextRef = useRef<HTMLButtonElement>(null);
  const againRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<HTMLDivElement>(null);

  // 选完答案选项都变成 disabled、换题时整块重画，焦点会掉回页面开头；用键盘玩的要接着能按
  useEffect(() => {
    if (!answered.current) return;
    const target = picked ? nextRef.current : done ? againRef.current : optionsRef.current?.querySelector("button");
    target?.focus();
  }, [picked, index, done]);

  const choose = (slug: string) => {
    if (picked) return;
    answered.current = true;
    setPicked(slug);
    if (slug === round.answer) setScore(score + 1);
  };
  const next = () => {
    setPicked(undefined);
    setIndex(index + 1);
  };
  const again = () => {
    setSeed(Math.floor(Math.random() * 1e9));
    setIndex(0);
    setPicked(undefined);
    setScore(0);
  };

  const answer = round ? dialectBySlug(round.answer) : undefined;
  const marks: Record<string, MapMark> = {};
  if (round && picked) {
    for (const slug of round.options) marks[slug] = "option";
    if (picked !== round.answer) marks[picked] = "wrong";
    marks[round.answer] = "right";
  }

  return (
    <div className="game">
      <header className="page-top">
        <button type="button" className="page-back" onClick={onBack}>← {backLabel}</button>
        <div className="page-heading">
          <span>{done ? "玩完一局" : `第 ${index + 1} 题 / 共 ${rounds.length} 题`} · 答对 {score} 题</span>
          <h1>🎯 猜猜是哪里话</h1>
        </div>
      </header>

      <ol className="game-dots" aria-hidden="true">
        {rounds.map((item, i) => <li key={item.prompt} className={i < index ? "is-done" : i === index ? "is-on" : ""} />)}
      </ol>

      {done ? (
        <section className="game-end">
          <p className="game-stars" aria-label={`答对 ${score} 题`}>{"⭐".repeat(score)}{"☆".repeat(rounds.length - score)}</p>
          <p className="game-line"><Avatar who="nian" /><span>我答对了 {score} 题！</span></p>
          <p className="game-line"><Avatar who="dad" /><span>{cheer(score)}</span></p>
          <div className="game-actions">
            <button ref={againRef} type="button" className="game-next" onClick={again}>再来一局 ↻</button>
            <button type="button" className="game-secondary" onClick={() => onMap()}>去方言地图 🗺️</button>
          </div>
        </section>
      ) : round && (
        <section className="game-round" key={round.prompt}>
          <div className="game-card">
            <p className="game-ask"><Avatar who="nian" />爸爸，这句话是哪里的人说的？</p>
            <p className="game-prompt">
              <b style={{ fontFamily: fontFamily.kai }}>{round.prompt}</b>
              <SayButton voice={round.voice} text={round.prompt} label="听一听" />
            </p>
            <div ref={optionsRef} className="game-options">
              {round.options.map((slug) => {
                const option = dialectBySlug(slug);
                if (!option) return null;
                const state = picked ? (slug === round.answer ? "is-right" : slug === picked ? "is-wrong" : "is-off") : "";
                return (
                  <button key={slug} type="button" className={`game-option ${state}`} disabled={Boolean(picked)} onClick={() => choose(slug)}
                    style={{ "--dot": familyColor[option.family_slug] } as CSSProperties}>
                    <strong>{option.name}</strong>
                    <small>📍 {option.point.province} · {option.dialect_family}</small>
                  </button>
                );
              })}
            </div>
          </div>

          {picked && answer && (
            <div className="game-feedback">
              <p className="game-verdict">{picked === round.answer ? "✅ 答对了！" : "❌ 差一点！"}</p>
              <p className="game-line">
                <Avatar who="dad" />
                <span>
                  这是<b>{answer.name}</b>。秘密藏在「<b style={{ fontFamily: fontFamily.kai }}>{round.clue}</b>」里：{round.hint}
                </span>
              </p>
              <DialectMap dialects={atlas.dialects} marks={marks} label="这一题的三个地方在地图上的位置" />
              <button ref={nextRef} type="button" className="game-next" onClick={next}>{index + 1 < rounds.length ? "下一题 →" : "看看我得了几颗星 ⭐"}</button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
