import { looks, type CharacterId } from "../data/characters";

/** Flat portraits that match the 3D characters' colours, for chat bubbles and lists. */
export function Avatar({ who }: { who: CharacterId }) {
  const { Skin, Hair, Shirt, Face } = looks[who].palette;
  const dad = who === "dad";
  return (
    <svg className="avatar" viewBox="0 0 40 40" aria-hidden="true">
      <path d="M5 40c1-8 7-11 15-11s14 3 15 11z" fill={Shirt} />
      <rect x={dad ? 10 : 8.5} y={dad ? 7 : 8} width={dad ? 20 : 23} height={dad ? 23 : 22} rx={dad ? 7 : 9} fill={Skin} />
      <path d={dad ? "M9 16c-1-8 4-12 11-12s12 4 11 12c-2-4-5-6-10-6-3 0-6 1-8 3z" : "M7.5 17c0-8 5-12 12.5-12s12.5 4 12.5 12c-3-3-6-5-10-5 0 2-4 3-7 3-3 0-5 0-8 2z"} fill={Hair} />
      <circle cx="15.5" cy="19.5" r="1.5" fill={Face} />
      <circle cx="24.5" cy="19.5" r="1.5" fill={Face} />
      <ellipse cx={dad ? 13.5 : 12.5} cy="23.5" rx="2" ry="1.2" fill="#ff8fa0" opacity="0.55" />
      <ellipse cx={dad ? 26.5 : 27.5} cy="23.5" rx="2" ry="1.2" fill="#ff8fa0" opacity="0.55" />
      <path d="M17.5 25c1.5 1.2 3.5 1.2 5 0" stroke={Face} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {dad && (
        <g fill="none" stroke="#24242c" strokeWidth="1.3">
          <circle cx="15.5" cy="19.5" r="3.4" />
          <circle cx="24.5" cy="19.5" r="3.4" />
          <path d="M18.9 19.2h2.2" />
        </g>
      )}
    </svg>
  );
}
