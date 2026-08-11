from __future__ import annotations

from dataclasses import dataclass
from typing import Dict, List

from dialect_data import DIALECTS, DIALECT_FAMILIES, DIALECT_LOOKUP, DIALECT_NAME_LOOKUP


@dataclass
class MatchFeature:
    name: str
    description: str
    example: str
    score: float


class DialectEngine:
    def __init__(self) -> None:
        self.dialects = DIALECTS
        self.families = DIALECT_FAMILIES

    def identify(self, text: str) -> Dict[str, List[Dict[str, object]]]:
        sample = (text or "").strip()
        if not sample:
            return {
                "possible_regions": [],
                "features": [],
                "learning_cards": [],
            }

        results = []
        for dialect in self.dialects:
            score, features = self._score_dialect(sample, dialect)
            if score > 0:
                results.append({"dialect": dialect, "score": score, "features": features})

        if not results:
            return {
                "possible_regions": self._fallback_regions(),
                "features": [
                    {
                        "name": "未命中特征",
                        "description": "当前文本没有明显命中已收录方言词，可尝试输入更口语化的句子。",
                        "example": "例如：‘你搁这儿嘎哈呢？’、‘我冇带钥匙。’",
                    }
                ],
                "learning_cards": self.get_learning_materials("mandarin"),
            }

        ranked = sorted(results, key=lambda item: item["score"], reverse=True)
        top = ranked[:3]
        total = sum(item["score"] for item in top) or 1.0

        possible_regions = [
            {
                "region": item["dialect"]["region"],
                "score": round(item["score"] / total, 2),
                "dialect_family": item["dialect"]["dialect_family"],
                "dialect": item["dialect"]["name"],
            }
            for item in top
        ]

        matched_features = self._merge_features(top)
        learning_cards = self.get_learning_materials(top[0]["dialect"]["slug"])
        return {
            "possible_regions": possible_regions,
            "features": matched_features,
            "learning_cards": learning_cards,
        }

    def list_families(self) -> List[Dict[str, object]]:
        family_dialects: Dict[str, List[Dict[str, str]]] = {}
        for dialect in self.dialects:
            family_dialects.setdefault(dialect["family_slug"], []).append(
                {
                    "name": dialect["name"],
                    "region": dialect["region"],
                    "slug": dialect["slug"],
                }
            )

        payload = []
        for family in self.families:
            payload.append(
                {
                    **family,
                    "dialects": family_dialects.get(family["slug"], []),
                }
            )
        return payload

    def get_learning_materials(self, dialect_key: str) -> List[Dict[str, object]]:
        dialect = DIALECT_LOOKUP.get(dialect_key) or DIALECT_NAME_LOOKUP.get(dialect_key)
        if not dialect:
            family = next((item for item in self.families if item["slug"] == dialect_key), None)
            if family:
                dialect = next((d for d in self.dialects if d["family_slug"] == family["slug"]), None)
        if not dialect:
            return []

        vocab_examples = [entry["term"] for entry in dialect["vocabulary"][:3]]
        expression_examples = [entry["text"] for entry in dialect["expressions"][:3]]
        grammar_examples = [entry["name"] for entry in dialect["grammar_features"][:2]]

        return [
            {
                "title": f"{dialect['name']}｜核心词汇",
                "content": "先记最能暴露地域身份的高频词，优先在问候、否定、称呼里练习。",
                "examples": vocab_examples,
            },
            {
                "title": f"{dialect['name']}｜表达套路",
                "content": "把常见寒暄和固定搭配整句背下来，比单字记忆更容易进入语感。",
                "examples": expression_examples,
            },
            {
                "title": f"{dialect['name']}｜语法观察",
                "content": "注意代词、疑问词、否定词和句末语气词，这些往往最容易识别方言。",
                "examples": grammar_examples,
            },
        ]

    def _score_dialect(self, text: str, dialect: Dict[str, object]) -> tuple[float, List[MatchFeature]]:
        score = 0.0
        features: List[MatchFeature] = []
        seen = set()

        for entry in dialect["vocabulary"]:
            term = entry["term"]
            if term in text:
                score += entry["weight"]
                key = ("vocab", term)
                if key not in seen:
                    features.append(
                        MatchFeature(
                            name=f"词汇：{term}",
                            description=entry["description"],
                            example=entry["example"],
                            score=entry["weight"],
                        )
                    )
                    seen.add(key)

        for feature_type in ("grammar_features", "phonological_features"):
            for entry in dialect[feature_type]:
                keywords = entry.get("keywords") or entry.get("markers") or []
                matched = [keyword for keyword in keywords if keyword and keyword in text]
                if matched:
                    addition = entry.get("weight", 1.0) + 0.25 * max(len(matched) - 1, 0)
                    score += addition
                    key = (feature_type, entry["name"])
                    if key not in seen:
                        features.append(
                            MatchFeature(
                                name=entry["name"],
                                description=entry["description"],
                                example=entry["example"],
                                score=addition,
                            )
                        )
                        seen.add(key)

        for expression in dialect["expressions"]:
            snippet = expression["text"]
            if snippet in text:
                bonus = 1.4
                score += bonus
                key = ("expr", snippet)
                if key not in seen:
                    features.append(
                        MatchFeature(
                            name=f"惯用句：{snippet}",
                            description=expression["meaning"],
                            example=snippet,
                            score=bonus,
                        )
                    )
                    seen.add(key)

        if dialect["dialect_family"] == "官话" and "儿" in text:
            score += 0.3
        if dialect["dialect_family"] == "粤语" and any(token in text for token in ["冇", "唔", "佢"]):
            score += 0.4
        if dialect["dialect_family"] == "闽南语" and any(token in text for token in ["袂", "歹势", "呷"]):
            score += 0.4
        if dialect["dialect_family"] == "吴语" and any(token in text for token in ["侬", "阿拉", "弗"]):
            score += 0.4

        return score, features

    def _merge_features(self, ranked: List[Dict[str, object]]) -> List[Dict[str, str]]:
        merged: Dict[str, MatchFeature] = {}
        for item in ranked:
            for feature in item["features"]:
                current = merged.get(feature.name)
                if current is None or feature.score > current.score:
                    merged[feature.name] = feature

        top_features = sorted(merged.values(), key=lambda feature: feature.score, reverse=True)[:6]
        return [
            {
                "name": feature.name,
                "description": feature.description,
                "example": feature.example,
            }
            for feature in top_features
        ]

    def _fallback_regions(self) -> List[Dict[str, object]]:
        fallbacks = [
            ("北京", "官话", "北京话"),
            ("广州", "粤语", "广州话"),
            ("上海", "吴语", "上海话"),
        ]
        return [
            {
                "region": region,
                "score": round(1 / 3, 2),
                "dialect_family": family,
                "dialect": dialect,
            }
            for region, family, dialect in fallbacks
        ]


engine = DialectEngine()
