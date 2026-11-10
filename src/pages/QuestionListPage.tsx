import type { CSSProperties } from "react";
import { Avatar } from "../components/Avatar";
import { filmFor } from "../data/films";
import { difficultyLabel, questionsIn, topicById, topics, type DialectQuestion, type Difficulty, type TopicId } from "../data/questions";
import "./Questions.css";

type Props = {
  topic: TopicId;
  heard: readonly string[];
  onBack: () => void;
  onOpen: (id: string) => void;
  onTopic: (id: TopicId) => void;
};

const difficulties: readonly Difficulty[] = [1, 2, 3];
const difficultyHint: Record<Difficulty, string> = {
  1: "一听就懂的小问题",
  2: "要多想一步：这些话是怎么一点点变过来的？",
  3: "藏得更深的问题，大人也常常答不全"
};

function QuestionCard({ question, heard, onOpen }: { question: DialectQuestion; heard: boolean; onOpen: () => void }) {
  const topic = topicById(question.topic);
  return (
    <button type="button" className={`qlist-card ${heard ? "is-heard" : ""}`} onClick={onOpen}
      style={{ "--bubble": topic?.color ?? "#ff9f43" } as CSSProperties}>
      <strong>{question.title}</strong>
      <small className="qlist-trigger">{question.trigger}</small>
      <span className="qlist-badges">
        <em>💬 {question.dialogue.length} 问 {question.dialogue.length} 答</em>
        {filmFor(question.id) && <em>🎬 有动画</em>}
        {heard && <em className="is-star">⭐ 听过</em>}
        <em className="is-words">{question.words.slice(0, 4).join(" · ")}</em>
      </span>
    </button>
  );
}

export function QuestionListPage({ topic: topicId, heard, onBack, onOpen, onTopic }: Props) {
  const topic = topicById(topicId);
  const questions = questionsIn(topicId);
  const heardCount = questions.filter((question) => heard.includes(question.id)).length;
  if (!topic) return null;

  return (
    <div className="qlist">
      <header className="page-top">
        <button type="button" className="page-back" onClick={onBack}>← 回到首页</button>
        <div className="page-heading">
          <span>{questions.length} 个问题 · 听过 {heardCount} 个</span>
          <h1>{topic.emoji} {topic.title}</h1>
        </div>
      </header>

      <div className="qlist-intro" style={{ "--bubble": topic.color } as CSSProperties}>
        <p><Avatar who="nian" /><strong>小念：</strong>{topic.kidHook}</p>
        <p><Avatar who="dad" /><strong>爸爸：</strong>这一类其实都在讲{topic.dadLens}。挑一个问题，我们从头聊到底。</p>
      </div>

      {difficulties.map((level) => {
        const group = questions.filter((question) => question.difficulty === level);
        if (group.length === 0) return null;
        return (
          <section key={level} className="qlist-group" aria-label={difficultyLabel[level]}>
            <h2>{"⭐".repeat(level)} {difficultyLabel[level]}<small>{difficultyHint[level]}</small></h2>
            <div className="qlist-grid">
              {group.map((question) => (
                <QuestionCard key={question.id} question={question} heard={heard.includes(question.id)} onOpen={() => onOpen(question.id)} />
              ))}
            </div>
          </section>
        );
      })}

      <nav className="qlist-other" aria-label="换一个主题">
        <h2>换一个主题</h2>
        <div className="qlist-chips">
          {topics.map((item) => (
            <button key={item.id} type="button" aria-current={item.id === topicId ? "true" : undefined}
              onClick={() => onTopic(item.id)}>{item.emoji} {item.title}</button>
          ))}
        </div>
      </nav>
    </div>
  );
}
