import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Avatar } from "../components/Avatar";
import { FilmPlayer, type FilmPlayerHandle } from "../components/film/FilmPlayer";
import { SayButton } from "../components/SayButton";
import { conceptBySlug } from "../data/atlas";
import { characterNames as names, type CharacterId } from "../data/characters";
import { filmFor } from "../data/films";
import { difficultyLabel, nextQuestions, topicById, type BeatShow, type DialectQuestion } from "../data/questions";
import { voiceFor } from "../data/voice";
import { useInView } from "../hooks/useInView";
import { fontFamily } from "../lib/fonts";
import type { Speaker } from "../lib/narration";
import "./Questions.css";

type Props = {
  question: DialectQuestion;
  heard: readonly string[];
  onHeard: (id: string) => void;
  onBack: () => void;
  onOpen: (id: string) => void;
  onMap: (concept?: string) => void;
};

function Bubble({ who, index, speaking, children }: { who: CharacterId; index: number; speaking?: boolean; children: ReactNode }) {
  return (
    <div className={`qa-line is-${who}${speaking ? " is-speaking" : ""}`} style={{ "--i": index } as CSSProperties}>
      <span className="qa-avatar"><Avatar who={who} /></span>
      <div className="qa-bubble">
        <span className="qa-name">{names[who]}</span>
        {children}
      </div>
    </div>
  );
}

function Show({ show }: { show: BeatShow }) {
  switch (show.kind) {
    case "steps":
      return (
        <ol className="qa-steps" aria-label="图解">
          {show.frames.map((frame, index) => (
            <li key={frame.label} style={{ "--i": index } as CSSProperties}>
              <span aria-hidden="true">{frame.icon}</span>
              <small>{frame.label}</small>
            </li>
          ))}
        </ol>
      );
    case "say":
      return (
        <ul className="qa-say" aria-label="听一听">
          {show.lines.map((line, index) => (
            <li key={`${line.label}-${line.text}`} style={{ "--i": index } as CSSProperties}>
              <span className="qa-say-label">{line.label}</span>
              <b style={{ fontFamily: fontFamily.kai }}>{line.text}</b>
              {line.sub && <small>{line.sub}</small>}
              <SayButton voice={line.voice} text={line.text} />
            </li>
          ))}
        </ul>
      );
    case "image":
      return (
        <figure className="qa-figure">
          <img className="qa-media" src={show.src} alt={show.alt} loading="lazy" />
          <figcaption>{show.caption}<small>{show.credit}</small></figcaption>
        </figure>
      );
    case "video":
      return <video className="qa-media" src={show.src} poster={show.poster} aria-label={show.alt} controls playsInline />;
  }
}

export function QuestionPage({ question, heard, onHeard, onBack, onOpen, onMap }: Props) {
  const topic = topicById(question.topic);
  const film = filmFor(question.id);
  const voice = useMemo(() => voiceFor(question), [question]);
  const filmTurns = new Set(film?.scenes.map((scene) => scene.turn));
  const player = useRef<FilmPlayerHandle>(null);
  const filmBox = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<{ turn: number; who?: Speaker } | null>(null);
  const [endRef, reachedEnd] = useInView<HTMLDivElement>(false);
  const onTurn = useCallback((turn: number, who?: Speaker) => setPlaying({ turn, who }), []);
  const turnRefs = useRef<(HTMLDivElement | null)[]>([]);
  const spokenTurn = playing?.who ? playing.turn : undefined;
  const concepts = (question.concepts ?? []).map(conceptBySlug).filter((concept) => concept !== undefined);

  useEffect(() => {
    if (spokenTurn === undefined || !window.matchMedia("(min-width: 901px)").matches) return;
    turnRefs.current[spokenTurn]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [spokenTurn]);

  const watch = (turn: number) => {
    player.current?.playTurn(turn);
    filmBox.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  useEffect(() => {
    if (reachedEnd) onHeard(question.id);
  }, [reachedEnd, question.id, onHeard]);

  return (
    <div className="qa">
      <header className="page-top">
        <button type="button" className="page-back" onClick={onBack}>← {topic?.emoji} {topic?.title}</button>
        <div className="page-heading">
          <span>
            {difficultyLabel[question.difficulty]}
            {heard.includes(question.id) && " · ⭐ 听过"}
          </span>
          <h1>{question.title}</h1>
        </div>
      </header>

      <main className={film ? "qa-main has-film" : "qa-main"}>
        {film && (
          <div ref={filmBox} className="qa-film">
            <FilmPlayer ref={player} film={film} voice={voice} onTurn={onTurn} />
          </div>
        )}
        <section className="qa-chat" aria-label="小念和爸爸的问答">
          <p className="qa-scene"><span aria-hidden="true">📍</span>{question.trigger}</p>
          {question.dialogue.map((turn, index) => (
            <div key={index} ref={(node) => { turnRefs.current[index] = node; }} className={playing?.turn === index ? "qa-turn is-playing" : "qa-turn"}>
              <Bubble who="nian" index={index * 2} speaking={playing?.turn === index && playing.who === "nian"}><p>{turn.nian}</p></Bubble>
              <Bubble who="dad" index={index * 2 + 1} speaking={playing?.turn === index && playing.who === "dad"}>
                <p>{turn.dad}</p>
                {turn.show && <Show show={turn.show} />}
                {filmTurns.has(index) && (
                  <button type="button" className="qa-watch" onClick={() => watch(index)}>🎬 看动画</button>
                )}
              </Bubble>
            </div>
          ))}
        </section>
        <div ref={endRef} className="qa-end" />

        <section className="qa-wrap" aria-label="听完以后">
          <div className="qa-words">
            <h3>🗝️ 这一问里的方言词</h3>
            <div>{question.words.map((word) => <span key={word} style={{ fontFamily: fontFamily.kai }}>{word}</span>)}</div>
          </div>
          {concepts.length > 0 && (
            <div className="qa-concepts">
              <h3>🗺️ 去方言地图上看看，各地还怎么说</h3>
              <div>
                {concepts.map((concept) => (
                  <button key={concept.slug} type="button" onClick={() => onMap(concept.slug)}>「{concept.headword}」各地怎么说 →</button>
                ))}
              </div>
            </div>
          )}
          <div className="qa-related">
            <h3><Avatar who="nian" /> 小念还想问</h3>
            {nextQuestions(question).map((item) => (
              <button key={item.id} type="button" onClick={() => onOpen(item.id)}>
                {item.title}{heard.includes(item.id) ? " ⭐" : ""}
              </button>
            ))}
          </div>
          <details className="parent-tip">
            <summary>👨‍👩‍👧 给大人</summary>
            <p>{question.parentTip}</p>
          </details>
        </section>
      </main>
    </div>
  );
}
