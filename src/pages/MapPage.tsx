import { useMemo, useState, type CSSProperties } from "react";
import { Avatar } from "../components/Avatar";
import { DialectMap } from "../components/DialectMap";
import { SayButton } from "../components/SayButton";
import { atlas, conceptBySlug, dialectBySlug, familyBySlug } from "../data/atlas";
import { questionsAbout } from "../data/questions";
import { confidenceLabel, familyColor, formsByDialect, type Concept, type Dialect, type Expression } from "../lib/atlas";
import { fontFamily } from "../lib/fonts";
import { dialectVoice } from "../lib/samples";
import "./Questions.css";
import "./MapPage.css";

/** 写法的种类，换成孩子听得懂的话 */
const orthographyLabel: Readonly<Record<string, string>> = {
  本字: "古书里就有的字",
  俗字: "后来造的字",
  借音字: "借个读音像的字",
  训读字: "借意思一样的字",
  通用字: "普通话也这么写",
  待考: "该写哪个字还在考证"
};

type Props = {
  concept?: string;
  onConcept: (slug?: string) => void;
  onOpen: (id: string) => void;
  onBack: () => void;
  backLabel: string;
};

function Form({ item }: { item: Expression }) {
  const voice = dialectVoice[item.dialect];
  return (
    <div className="map-form">
      <p className="map-form-head">
        <b style={{ fontFamily: fontFamily.kai }}>{item.form}</b>
        {item.romanization && <small>{item.romanization.text}<i>{item.romanization.scheme}</i></small>}
        <SayButton voice={voice} text={item.form} />
      </p>
      <p className="map-tags">
        <span>{orthographyLabel[item.orthography] ?? item.orthography}{item.etymon ? `：原来是「${item.etymon}」` : ""}</span>
        <span>{item.status}</span>
        <span className={`is-${item.confidence}`}>{confidenceLabel[item.confidence]}</span>
      </p>
      {item.example && (
        <p className="map-example">
          <span style={{ fontFamily: fontFamily.kai }}>{item.example}</span>
          <SayButton voice={voice} text={item.example} />
          {item.example_gloss && <small>意思是：{item.example_gloss}</small>}
        </p>
      )}
      {item.note && <p className="map-note">{item.note}</p>}
    </div>
  );
}

function DialectHead({ dialect }: { dialect: Dialect }) {
  return (
    <header className="map-card-head" style={{ "--dot": familyColor[dialect.family_slug] } as CSSProperties}>
      <strong>{dialect.name}</strong>
      <span>📍 {dialect.point.province} {dialect.point.name} · {dialect.classification.path.join(" › ")}</span>
    </header>
  );
}

function ConceptCard({ concept, dialect }: { concept: Concept; dialect?: Dialect }) {
  const forms = formsByDialect(concept);
  if (dialect) {
    const items = forms.get(dialect.slug) ?? [];
    return (
      <div className="map-card">
        <DialectHead dialect={dialect} />
        <p className="map-card-lead">「{concept.headword}」在{dialect.name}里说：</p>
        {items.length ? items.map((item) => <Form key={item.form} item={item} />) : <p className="map-empty">这个词我们还没收到{dialect.name}的说法。</p>}
      </div>
    );
  }
  return (
    <div className="map-card">
      <header className="map-card-head is-concept">
        <strong style={{ fontFamily: fontFamily.kai }}>「{concept.headword}」</strong>
        <span>{concept.gloss}</span>
      </header>
      <p className="map-card-lead">👆 点地图上的气泡，看看那里怎么说、怎么用。按方言大区排一排：</p>
      <ul className="map-family-forms">
        {atlas.families.map((family) => {
          const words = atlas.dialects.filter((d) => d.family_slug === family.slug).flatMap((d) => forms.get(d.slug) ?? []).map((item) => item.form);
          const unique = [...new Set(words)];
          if (!unique.length) return null;
          return (
            <li key={family.slug} style={{ "--dot": familyColor[family.slug] } as CSSProperties}>
              <span>{family.name}</span><b style={{ fontFamily: fontFamily.kai }}>{unique.join("、")}</b>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DialectCard({ dialect }: { dialect: Dialect }) {
  const voice = dialectVoice[dialect.slug];
  const family = familyBySlug(dialect.family_slug);
  return (
    <div className="map-card">
      <DialectHead dialect={dialect} />
      <p className="map-card-lead">{dialect.overview}</p>
      {family && <p className="map-family-note">属于<b>{family.name}</b>：{family.summary}</p>}
      <h3>🗝️ 常听到的词</h3>
      <ul className="map-words">
        {dialect.vocabulary.map((item) => (
          <li key={item.term}>
            <b style={{ fontFamily: fontFamily.kai }}>{item.term}</b><SayButton voice={voice} text={item.term} />
            <span>{item.description}</span>
            {item.example && <small style={{ fontFamily: fontFamily.kai }}>{item.example} <SayButton voice={voice} text={item.example} /></small>}
          </li>
        ))}
      </ul>
      <h3>💬 常说的话</h3>
      <ul className="map-words">
        {dialect.expressions.map((item) => (
          <li key={item.text}>
            <b style={{ fontFamily: fontFamily.kai }}>{item.text}</b><SayButton voice={voice} text={item.text} />
            <span>{item.meaning}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MapPage({ concept: conceptSlug, onConcept, onOpen, onBack, backLabel }: Props) {
  const concept = conceptSlug ? conceptBySlug(conceptSlug) : undefined;
  const [selected, setSelected] = useState<string | undefined>();
  const [family, setFamily] = useState<string | undefined>();
  const forms = useMemo(() => (concept ? formsByDialect(concept) : undefined), [concept]);
  const dialect = selected ? dialectBySlug(selected) : undefined;
  const stories = concept ? atlas.topics.filter((topic) => topic.concepts.includes(concept.slug)) : [];
  const asked = concept ? questionsAbout(concept.slug) : [];

  const pillText = forms ? (d: Dialect) => {
    const items = forms.get(d.slug);
    return items ? [...new Set(items.map((item) => item.form))].join("／") : undefined;
  } : undefined;

  return (
    <div className="map-page">
      <header className="page-top">
        <button type="button" className="page-back" onClick={onBack}>← {backLabel}</button>
        <div className="page-heading">
          <span>{atlas.dialects.length} 个方言点 · {atlas.concepts.length} 个词</span>
          <h1>🗺️ 方言地图</h1>
        </div>
      </header>

      <div className="qlist-intro" style={{ "--bubble": "#3d9be9" } as CSSProperties}>
        <p><Avatar who="nian" /><strong>小念：</strong>同一个意思，各地到底怎么说？</p>
        <p><Avatar who="dad" /><strong>爸爸：</strong>挑一个词，地图上每个地方都会冒出一个气泡。带 🔊 的可以点着听：粤语和东北话是电脑合成的方言声音。</p>
      </div>

      <nav className="map-chips" aria-label="挑一个词">
        <button type="button" aria-pressed={!concept} onClick={() => onConcept(undefined)}>📍 方言点</button>
        {atlas.concepts.map((item) => (
          <button key={item.slug} type="button" aria-pressed={concept?.slug === item.slug} onClick={() => onConcept(item.slug)}
            style={{ fontFamily: fontFamily.kai }}>{item.headword.replace(/（.*）/, "")}</button>
        ))}
      </nav>

      <div className="map-layout">
        <div className="map-stage">
          <DialectMap
            dialects={atlas.dialects} pillText={pillText} selected={selected} family={family}
            onSelect={(slug) => setSelected(slug === selected ? undefined : slug)}
            label={concept ? `「${concept.headword}」在各地的说法，点一个地方看详情` : "方言点地图，点一个地方看详情"}
          />
          <ul className="map-legend" aria-label="方言大区">
            {atlas.families.map((item) => (
              <li key={item.slug}>
                <button type="button" aria-pressed={family === item.slug} style={{ "--dot": familyColor[item.slug] } as CSSProperties}
                  onClick={() => setFamily(family === item.slug ? undefined : item.slug)}>{item.name}</button>
              </li>
            ))}
          </ul>
          <p className="map-disclaimer">示意地图：只画了海岸线和长江、黄河，点的位置是方言代表点。</p>
        </div>

        <aside className="map-side" aria-live="polite">
          {concept ? <ConceptCard concept={concept} dialect={dialect} />
            : dialect ? <DialectCard dialect={dialect} />
              : (
                <div className="map-card">
                  <p className="map-card-lead">👆 点地图上的一个地方，看看那里的人怎么说话；或者在上面挑一个词。</p>
                  <ul className="map-family-forms">
                    {atlas.families.map((item) => (
                      <li key={item.slug} style={{ "--dot": familyColor[item.slug] } as CSSProperties}>
                        <span>{item.name}</span><small>{item.summary}</small>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
        </aside>
      </div>

      {stories.length > 0 && (
        <section className="map-stories" aria-label="小故事">
          <h2>📚 爸爸讲的小故事</h2>
          {stories.map((story) => (
            <article key={story.slug}>
              <h3>{story.title}</h3>
              <p className="map-story-lead">{story.summary}</p>
              {story.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </article>
          ))}
        </section>
      )}

      {asked.length > 0 && (
        <section className="qa-related map-asked">
          <h3><Avatar who="nian" /> 小念问过爸爸</h3>
          {asked.map((item) => <button key={item.id} type="button" onClick={() => onOpen(item.id)}>{item.title}</button>)}
        </section>
      )}

      <details className="parent-tip">
        <summary>👨‍👩‍👧 给大人</summary>
        {concept?.etymology?.map((item) => <p key={item.character}>「{item.character}」：{item.note}（{confidenceLabel[item.confidence]}）</p>)}
        <p>地图上的说法来自本项目的方言知识库（<code>data/</code> 目录），绝大多数已和维基词典的方言同义词表（<a href="https://en.wiktionary.org/wiki/Module:zh/data/dial-syn" target="_blank" rel="noreferrer">dial-syn</a>，CC BY-SA 4.0）核对过，但还没有逐条请母语者确认；一个地方往往不止一种说法，这里只列常见的一两种，标着"还要再核对"的条目欢迎指正。方言分区参考《中国语言地图集（第2版）》。「听一听」用的是微软 Edge 的合成语音（粤语用香港粤语音色，东北话用辽宁口音音色），只能当作参考，最好还是请会说的长辈读给孩子听。</p>
      </details>
    </div>
  );
}
