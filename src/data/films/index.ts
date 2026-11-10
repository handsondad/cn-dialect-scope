import { films as familyFilms } from "./family.ts";
import { films as funFilms } from "./fun.ts";
import { films as soundFilms } from "./sound.ts";
import type { Film } from "./types.ts";
import { films as whyFilms } from "./why.ts";
import { films as wordsFilms } from "./words.ts";

export type { Film } from "./types.ts";

export const films: readonly Film[] = [...whyFilms, ...familyFilms, ...soundFilms, ...wordsFilms, ...funFilms];

const byQuestion = new Map(films.map((film) => [film.question, film]));

export function filmFor(question: string): Film | undefined {
  return byQuestion.get(question);
}
