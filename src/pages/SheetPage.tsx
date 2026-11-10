import { FilmStage } from "../components/film/FilmStage";
import { films } from "../data/films";
import "../components/film/Film.css";

/** 开发时用：把每部动画每一段的最后一刻排成一张总览，检查有没有挤在一起、出了画面 */
export function SheetPage({ question }: { question?: string }) {
  const list = question ? films.filter((film) => film.question === question) : films;
  return (
    <main style={{ padding: 16 }}>
      {list.map((film) => (
        <section key={film.question} style={{ marginBottom: 32 }}>
          <h2 style={{ margin: "8px 0" }}>{film.question}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 330px)", gap: 12 }}>
            {film.scenes.map((scene, index) => (
              <div key={index} className="film">
                <FilmStage scene={scene} t={scene.duration - 0.9} isLast={false} number={index + 1} />
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
