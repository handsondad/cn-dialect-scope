// 查维基词典的「方言同义词」表（Module:zh/data/dial-syn/<词>），列出网站方言点和候选方言点的说法。
// 表里的词条大多整理自《汉语方言词汇》《现代汉语方言大词典》等，用来核对 data/ 里的说法、找新例子。
// 用法：node tools/dial-syn.mjs 沒有 太陽 筷子 …（用繁体字，和维基词典的页面名一致）
const places = [
  ["Beijing", "北京"], ["Harbin", "哈尔滨"], ["Shenyang", "沈阳"], ["Jinan", "济南"], ["Xi'an", "西安"],
  ["Lanzhou", "兰州"], ["Yinchuan", "银川"], ["Chengdu", "成都"], ["Wuhan", "武汉"], ["Nanjing", "南京"],
  ["Taiyuan", "太原"], ["Shanghai", "上海"], ["Suzhou", "苏州"], ["Hangzhou", "杭州"], ["Wenzhou", "温州"],
  ["Changsha", "长沙"], ["Nanchang", "南昌"], ["Meixian", "梅县"], ["Guangzhou", "广州"], ["Hong Kong", "香港"],
  ["Taishan", "台山"], ["Nanning", "南宁"], ["Xiamen", "厦门"], ["Taipei", "台北"], ["Shantou", "汕头"],
  ["Chaozhou", "潮州"], ["Fuzhou", "福州"], ["Haikou", "海口"], ["Singapore-MN", "新加坡闽南"]
];

async function lookup(word) {
  const url = `https://en.wiktionary.org/w/index.php?title=Module:zh/data/dial-syn/${encodeURIComponent(word)}&action=raw`;
  const response = await fetch(url, { headers: { "user-agent": "dialectverse-research/0.1" } });
  if (!response.ok) return { word, error: `HTTP ${response.status}` };
  const text = await response.text();
  const entry = (name) => {
    const match = text.match(new RegExp(`\\["${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\]\\s*=\\s*\\{([^}]*)\\}`));
    if (!match) return undefined;
    const forms = [...match[1].matchAll(/"([^"]*)"/g)].map((m) => m[1]).filter(Boolean);
    return forms.length ? forms.join("、") : undefined;
  };
  const meaning = text.match(/\["meaning"\]\s*=\s*"([^"]*)"/)?.[1] ?? "";
  const note = text.match(/\["note"\]\s*=\s*"([^"]*)"/)?.[1] ?? "";
  return { word, meaning, note, classical: entry("Classical"), forms: places.map(([key, zh]) => [zh, entry(key)]) };
}

for (const word of process.argv.slice(2)) {
  const result = await lookup(word);
  if (result.error) {
    console.log(`# ${word}：${result.error}`);
    continue;
  }
  console.log(`# ${word}（${result.meaning}）${result.classical ? ` 古：${result.classical}` : ""}${result.note ? ` 注：${result.note}` : ""}`);
  console.log(result.forms.filter(([, form]) => form).map(([zh, form]) => `${zh} ${form}`).join(" ｜ "));
}
