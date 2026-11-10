import { coast, geo, islands, land, rivers, type Point } from "../lib/geo";

const points = (list: readonly Point[]) => list.map((p) => p.join(",")).join(" ");

/** 示意地图：陆地、海岸线、台湾岛和海南岛、长江和黄河。海的颜色由外面的底色给 */
export function MapBackdrop({ labels = true }: { labels?: boolean }) {
  const [yangtzeX, yangtzeY] = geo(110.2, 31.9);
  const [yellowX, yellowY] = geo(108.6, 41.6);
  const [seaX, seaY] = geo(125.2, 28.4);
  return (
    <g className="map-backdrop" aria-hidden="true">
      <polygon points={points(land)} fill="#f8eed6" />
      {islands.map((island, i) => <polygon key={i} points={points(island)} fill="#f8eed6" stroke="#8fc3df" strokeWidth={4} strokeLinejoin="round" />)}
      <polyline points={points(coast)} fill="none" stroke="#8fc3df" strokeWidth={5} strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={points(rivers.yellow)} fill="none" stroke="#d6a446" strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" opacity={0.85} />
      <polyline points={points(rivers.yangtze)} fill="none" stroke="#4fa3e0" strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" opacity={0.85} />
      {labels && (
        <g className="map-backdrop-labels" fontSize={30} fontWeight={800} textAnchor="middle">
          <text x={yellowX} y={yellowY} fill="#b07f22">黄河</text>
          <text x={yangtzeX} y={yangtzeY} fill="#2f7fbf">长江</text>
          <text x={seaX} y={seaY} fill="#5d9cc0" fontSize={34}>大海</text>
        </g>
      )}
    </g>
  );
}
