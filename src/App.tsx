import { useEffect, useRef, useState } from "react";
import { conceptBySlug } from "./data/atlas";
import { questionById, topicById, type TopicId } from "./data/questions";
import { useHeardQuestions } from "./hooks/useHeardQuestions";
import { GamePage } from "./pages/GamePage";
import { HomePage } from "./pages/HomePage";
import { MapPage } from "./pages/MapPage";
import { QuestionListPage } from "./pages/QuestionListPage";
import { QuestionPage } from "./pages/QuestionPage";
import { SheetPage } from "./pages/SheetPage";

type Route =
  | { page: "home" }
  | { page: "list"; topic: TopicId }
  | { page: "question"; id: string }
  | { page: "map"; concept?: string }
  | { page: "game" }
  | { page: "sheet"; question?: string };

function parseRoute(hash: string): Route {
  const [, page, rawParam] = hash.replace(/^#/, "").split("/");
  const param = rawParam ? decodeURIComponent(rawParam) : undefined;
  if (page === "topic" && param && topicById(param)) return { page: "list", topic: param as TopicId };
  if (page === "q" && param && questionById(param)) return { page: "question", id: param };
  if (page === "map") return { page: "map", concept: param && conceptBySlug(param) ? param : undefined };
  if (page === "game") return { page: "game" };
  if (import.meta.env.DEV && page === "sheet") return { page: "sheet", question: param };
  return { page: "home" };
}

const listHash = (topic: TopicId) => `#/topic/${topic}`;
export const mapHash = (concept?: string) => (concept ? `#/map/${encodeURIComponent(concept)}` : "#/map");

function App() {
  const { heard, markHeard } = useHeardQuestions();
  const [route, setRoute] = useState(() => parseRoute(window.location.hash));
  /** 从哪个列表、哪个问题进来的，返回时回到那里而不是一直跳回首页 */
  const lastList = useRef<TopicId | null>(null);
  const lastQuestion = useRef<string | null>(null);

  useEffect(() => {
    const onHash = () => setRoute(parseRoute(window.location.hash));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  // 地图上换一个词只换气泡，不要跳回页面顶上
  const routeKey = route.page === "map" ? "map" : JSON.stringify(route);
  useEffect(() => {
    if (route.page === "home") {
      lastList.current = null;
      lastQuestion.current = null;
    }
    if (route.page === "list") {
      lastList.current = route.topic;
      lastQuestion.current = null;
    }
    if (route.page === "question") lastQuestion.current = route.id;
    window.scrollTo(0, 0);
  }, [routeKey]);

  const go = (hash: string) => { window.location.hash = hash; };
  const goHome = () => go("#/");
  const openQuestion = (id: string) => go(`#/q/${id}`);
  const openMap = (concept?: string) => go(mapHash(concept));

  if (route.page === "question") {
    const question = questionById(route.id);
    if (question) {
      const back = lastList.current ?? question.topic;
      return (
        <QuestionPage key={question.id} question={question} heard={heard} onHeard={markHeard}
          onBack={() => go(listHash(back))} onOpen={openQuestion} onMap={openMap} />
      );
    }
  }
  if (route.page === "list") {
    return (
      <QuestionListPage key={route.topic} topic={route.topic} heard={heard}
        onBack={goHome} onOpen={openQuestion} onTopic={(id) => go(listHash(id))} />
    );
  }
  const fromQuestion = lastQuestion.current ? questionById(lastQuestion.current) : undefined;
  const back = fromQuestion ? () => openQuestion(fromQuestion.id) : goHome;
  const backLabel = fromQuestion ? "回到小念的问题" : "回到首页";
  if (route.page === "map") {
    return <MapPage concept={route.concept} onConcept={(slug) => go(mapHash(slug))} onOpen={openQuestion} onBack={back} backLabel={backLabel} />;
  }
  if (route.page === "game") {
    return <GamePage onBack={back} backLabel={backLabel} onMap={openMap} />;
  }
  if (route.page === "sheet") return <SheetPage question={route.question} />;
  return <HomePage heard={heard} onTopic={(id) => go(listHash(id))} onMap={() => openMap()} onGame={() => go("#/game")} />;
}

export default App;
