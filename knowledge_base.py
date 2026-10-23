from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional

DATA_DIR = Path(__file__).resolve().parent / "data"

CONFIDENCE_LEVELS = {"high": "共识", "medium": "需核对", "unverified": "待考"}
ORTHOGRAPHY_TYPES = {"本字", "俗字", "训读字", "借音字", "通用字", "待考"}
REGISTERS = {"口语", "书面", "俚俗", "通用"}
STATUSES = {"常用", "老派", "少用", "濒危"}
RELATION_TYPES = {"related", "synonym", "broader", "narrower"}
SOURCE_TYPES = {"editorial", "literature", "dictionary", "romanization", "fieldwork", "native_speaker"}


def _read_json(path: Path) -> Any:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


class KnowledgeBase:
    """Concept-centric dialect knowledge base backed by JSON files in ``data/``."""

    def __init__(self, data_dir: Path = DATA_DIR) -> None:
        self.data_dir = Path(data_dir)
        self.families: List[Dict[str, Any]] = _read_json(self.data_dir / "families.json")
        self.sources: List[Dict[str, Any]] = _read_json(self.data_dir / "sources.json")
        self.topics: List[Dict[str, Any]] = _read_json(self.data_dir / "topics.json")
        self.dialects: List[Dict[str, Any]] = self._load_dir("dialects")
        self.concepts: List[Dict[str, Any]] = self._load_dir("concepts")
        self.dialects.sort(key=lambda item: item.get("order", 0))

        self.family_lookup = {family["slug"]: family for family in self.families}
        self.dialect_lookup = {dialect["slug"]: dialect for dialect in self.dialects}
        self.dialect_name_lookup = {dialect["name"]: dialect for dialect in self.dialects}
        self.concept_lookup = {concept["slug"]: concept for concept in self.concepts}
        self.source_lookup = {source["id"]: source for source in self.sources}
        self.topic_lookup = {topic["slug"]: topic for topic in self.topics}

    def _load_dir(self, name: str) -> List[Dict[str, Any]]:
        return [_read_json(path) for path in sorted((self.data_dir / name).glob("*.json"))]

    # ------------------------------------------------------------------ queries

    def list_concepts(self, category: Optional[str] = None) -> List[Dict[str, Any]]:
        return [
            self._concept_summary(concept)
            for concept in self.concepts
            if not category or concept["category"] == category
        ]

    def get_concept(self, slug: str) -> Optional[Dict[str, Any]]:
        concept = self.concept_lookup.get(slug)
        if not concept:
            return None

        groups: Dict[str, Dict[str, Any]] = {}
        for expression in concept["expressions"]:
            dialect = self.dialect_lookup[expression["dialect"]]
            family = self.family_lookup[dialect["family_slug"]]
            group = groups.setdefault(
                family["slug"],
                {"family_slug": family["slug"], "family": family["name"], "expressions": []},
            )
            group["expressions"].append(self._expand_expression(expression, dialect))

        family_order = [family["slug"] for family in self.families]
        return {
            **{key: concept[key] for key in ("slug", "headword", "gloss", "category", "aliases")},
            "groups": sorted(groups.values(), key=lambda group: family_order.index(group["family_slug"])),
            "etymology": [self._with_sources(entry) for entry in concept.get("etymology", [])],
            "related": [
                {"type": relation["type"], **self._concept_summary(self.concept_lookup[relation["concept"]])}
                for relation in concept.get("related", [])
            ],
            "topics": [self._topic_summary(topic) for topic in self.topics if slug in topic["concepts"]],
        }

    def get_dialect_profile(self, slug: str) -> Optional[Dict[str, Any]]:
        dialect = self.dialect_lookup.get(slug) or self.dialect_name_lookup.get(slug)
        if not dialect:
            return None
        family = self.family_lookup[dialect["family_slug"]]
        concept_expressions = []
        for concept in self.concepts:
            for expression in concept["expressions"]:
                if expression["dialect"] == dialect["slug"]:
                    concept_expressions.append(
                        {
                            "concept": concept["slug"],
                            "headword": concept["headword"],
                            **self._expand_expression(expression, dialect),
                        }
                    )
        return {
            **{key: dialect[key] for key in ("slug", "name", "region", "dialect_family", "family_slug", "overview")},
            "family": {key: family[key] for key in ("slug", "name", "english_name", "summary")},
            "classification": self._with_sources(
                {**dialect["classification"], "sources": [dialect["classification"]["reference"]]}
            ),
            "point": dialect["point"],
            "vocabulary": [{key: entry[key] for key in ("term", "description", "example")} for entry in dialect["vocabulary"]],
            "features": self._dialect_features(dialect),
            "expressions": dialect["expressions"],
            "concept_expressions": concept_expressions,
            "sources": [self.source_lookup[source_id] for source_id in dialect.get("sources", [])],
        }

    def list_features(self, kind: Optional[str] = None) -> List[Dict[str, Any]]:
        features = []
        for dialect in self.dialects:
            features.extend(self._dialect_features(dialect, include_dialect=True))
        if kind:
            features = [feature for feature in features if feature["kind"] == kind]
        return features

    def list_topics(self) -> List[Dict[str, Any]]:
        return [self._topic_summary(topic) for topic in self.topics]

    def get_topic(self, slug: str) -> Optional[Dict[str, Any]]:
        topic = self.topic_lookup.get(slug)
        if not topic:
            return None
        return {
            **self._with_sources(topic),
            "confidence_label": CONFIDENCE_LEVELS[topic["confidence"]],
            "concepts": [self._concept_summary(self.concept_lookup[item]) for item in topic["concepts"]],
        }

    def search(self, query: str) -> Dict[str, List[Dict[str, Any]]]:
        needle = (query or "").strip().lower()
        if not needle:
            return {"concepts": [], "dialects": [], "topics": []}

        concepts = []
        for concept in self.concepts:
            matched_by = None
            if needle in concept["headword"].lower() or any(needle in alias.lower() for alias in concept["aliases"]):
                matched_by = "headword"
            elif needle in concept["gloss"].lower():
                matched_by = "gloss"
            else:
                for expression in concept["expressions"]:
                    romanization = expression.get("romanization", {}).get("text", "").lower()
                    if needle in expression["form"].lower() or needle in romanization:
                        matched_by = "expression"
                        break
            if matched_by:
                concepts.append({**self._concept_summary(concept), "matched_by": matched_by})

        rank = {"headword": 0, "expression": 1, "gloss": 2}
        concepts.sort(key=lambda item: rank[item["matched_by"]])

        dialects = [
            {"slug": dialect["slug"], "name": dialect["name"], "region": dialect["region"], "dialect_family": dialect["dialect_family"]}
            for dialect in self.dialects
            if needle in dialect["name"].lower()
            or needle in dialect["region"].lower()
            or needle in dialect["dialect_family"].lower()
            or needle in dialect["point"]["name"].lower()
        ]
        topics = [
            self._topic_summary(topic)
            for topic in self.topics
            if needle in topic["title"].lower() or needle in topic["summary"].lower()
        ]
        return {"concepts": concepts, "dialects": dialects, "topics": topics}

    # ------------------------------------------------------------------ helpers

    def _concept_summary(self, concept: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "slug": concept["slug"],
            "headword": concept["headword"],
            "gloss": concept["gloss"],
            "category": concept["category"],
            "expression_count": len(concept["expressions"]),
            "dialect_count": len({expression["dialect"] for expression in concept["expressions"]}),
        }

    def _topic_summary(self, topic: Dict[str, Any]) -> Dict[str, Any]:
        return {key: topic[key] for key in ("slug", "title", "summary", "concepts")}

    def _expand_expression(self, expression: Dict[str, Any], dialect: Dict[str, Any]) -> Dict[str, Any]:
        expanded = self._with_sources(expression)
        expanded["dialect"] = {
            "slug": dialect["slug"],
            "name": dialect["name"],
            "point": dialect["point"]["name"],
            "dialect_family": dialect["dialect_family"],
        }
        expanded["confidence_label"] = CONFIDENCE_LEVELS[expression["confidence"]]
        return expanded

    def _with_sources(self, entry: Dict[str, Any]) -> Dict[str, Any]:
        expanded = dict(entry)
        expanded["sources"] = [
            {key: self.source_lookup[source_id][key] for key in ("id", "type", "title")}
            for source_id in entry.get("sources", [])
        ]
        return expanded

    def _dialect_features(self, dialect: Dict[str, Any], include_dialect: bool = False) -> List[Dict[str, Any]]:
        features = []
        for kind, key in (("grammar", "grammar_features"), ("phonology", "phonological_features")):
            for entry in dialect[key]:
                feature = {
                    "kind": kind,
                    "name": entry["name"],
                    "description": entry["description"],
                    "example": entry["example"],
                    "markers": entry.get("keywords") or entry.get("markers") or [],
                }
                if include_dialect:
                    feature["dialect"] = {"slug": dialect["slug"], "name": dialect["name"]}
                features.append(feature)
        return features

    # --------------------------------------------------------------- validation

    def validate(self) -> List[str]:
        """Return a list of schema and referential-integrity errors (empty if valid)."""
        errors: List[str] = []

        def need(obj: Dict[str, Any], where: str, fields: Dict[str, Any]) -> None:
            for field, expected in fields.items():
                if field not in obj:
                    errors.append(f"{where}: missing field '{field}'")
                elif not isinstance(obj[field], expected) or isinstance(obj[field], bool):
                    errors.append(f"{where}: field '{field}' has the wrong type")

        def check_unique(items: List[Dict[str, Any]], key: str, label: str) -> None:
            seen = set()
            for item in items:
                value = item.get(key)
                if value in seen:
                    errors.append(f"{label}: duplicate {key} '{value}'")
                seen.add(value)

        def check_sources(entry: Dict[str, Any], where: str, required: bool = True) -> None:
            sources = entry.get("sources")
            if sources is None:
                if required:
                    errors.append(f"{where}: missing field 'sources'")
                return
            if not isinstance(sources, list) or not sources:
                errors.append(f"{where}: 'sources' must be a non-empty list")
                return
            for source_id in sources:
                if source_id not in self.source_lookup:
                    errors.append(f"{where}: unknown source '{source_id}'")

        def check_confidence(entry: Dict[str, Any], where: str) -> None:
            if entry.get("confidence") not in CONFIDENCE_LEVELS:
                errors.append(f"{where}: confidence must be one of {sorted(CONFIDENCE_LEVELS)}")

        for source in self.sources:
            need(source, f"source {source.get('id')}", {"id": str, "type": str, "title": str})
            if source.get("type") not in SOURCE_TYPES:
                errors.append(f"source {source.get('id')}: unknown type '{source.get('type')}'")
        check_unique(self.sources, "id", "sources")

        for family in self.families:
            where = f"family {family.get('slug')}"
            need(family, where, {"slug": str, "name": str, "english_name": str, "summary": str, "regions": list, "learning_focus": list})
            markers = family.get("identification_markers")
            if markers is not None:
                need(markers, f"{where}.identification_markers", {"tokens": list, "bonus": (int, float)})
        check_unique(self.families, "slug", "families")

        for dialect in self.dialects:
            where = f"dialect {dialect.get('slug')}"
            need(dialect, where, {
                "slug": str, "order": int, "name": str, "region": str, "dialect_family": str, "family_slug": str, "overview": str,
                "classification": dict, "point": dict, "vocabulary": list, "grammar_features": list,
                "phonological_features": list, "expressions": list,
            })
            family = self.family_lookup.get(dialect.get("family_slug"))
            if not family:
                errors.append(f"{where}: unknown family_slug '{dialect.get('family_slug')}'")
            elif family["name"] != dialect.get("dialect_family"):
                errors.append(f"{where}: dialect_family does not match family '{family['name']}'")
            classification = dialect.get("classification", {})
            if not isinstance(classification.get("path"), list) or not classification.get("path"):
                errors.append(f"{where}: classification.path must be a non-empty list")
            if classification.get("reference") not in self.source_lookup:
                errors.append(f"{where}: unknown classification reference '{classification.get('reference')}'")
            check_confidence(classification, f"{where}.classification")
            point = dialect.get("point", {})
            need(point, f"{where}.point", {"name": str, "province": str, "lat": (int, float), "lon": (int, float)})
            if isinstance(point.get("lat"), (int, float)) and not 3 <= point["lat"] <= 54:
                errors.append(f"{where}.point: latitude out of range")
            if isinstance(point.get("lon"), (int, float)) and not 73 <= point["lon"] <= 136:
                errors.append(f"{where}.point: longitude out of range")
            check_sources(dialect, where)
            for index, entry in enumerate(dialect.get("vocabulary", [])):
                need(entry, f"{where}.vocabulary[{index}]", {"term": str, "weight": (int, float), "description": str, "example": str})
            for key in ("grammar_features", "phonological_features"):
                for index, entry in enumerate(dialect.get(key, [])):
                    need(entry, f"{where}.{key}[{index}]", {"name": str, "description": str, "example": str})
                    if not (entry.get("keywords") or entry.get("markers")):
                        errors.append(f"{where}.{key}[{index}]: needs 'keywords' or 'markers'")
            for index, entry in enumerate(dialect.get("expressions", [])):
                need(entry, f"{where}.expressions[{index}]", {"text": str, "meaning": str})
        check_unique(self.dialects, "slug", "dialects")
        check_unique(self.dialects, "order", "dialects")

        for concept in self.concepts:
            where = f"concept {concept.get('slug')}"
            need(concept, where, {
                "slug": str, "headword": str, "gloss": str, "category": str, "aliases": list,
                "related": list, "etymology": list, "expressions": list,
            })
            if not concept.get("expressions"):
                errors.append(f"{where}: needs at least one expression")
            for relation in concept.get("related", []):
                if relation.get("concept") not in self.concept_lookup or relation.get("concept") == concept.get("slug"):
                    errors.append(f"{where}: invalid related concept '{relation.get('concept')}'")
                if relation.get("type") not in RELATION_TYPES:
                    errors.append(f"{where}: unknown relation type '{relation.get('type')}'")
            for index, entry in enumerate(concept.get("etymology", [])):
                entry_where = f"{where}.etymology[{index}]"
                need(entry, entry_where, {"character": str, "note": str})
                check_confidence(entry, entry_where)
                check_sources(entry, entry_where)
            for index, expression in enumerate(concept.get("expressions", [])):
                entry_where = f"{where}.expressions[{index}]"
                need(expression, entry_where, {"dialect": str, "form": str, "orthography": str, "register": str, "status": str})
                if expression.get("dialect") not in self.dialect_lookup:
                    errors.append(f"{entry_where}: unknown dialect '{expression.get('dialect')}'")
                if expression.get("orthography") not in ORTHOGRAPHY_TYPES:
                    errors.append(f"{entry_where}: unknown orthography '{expression.get('orthography')}'")
                if expression.get("orthography") == "俗字" and expression.get("form") == expression.get("etymon"):
                    errors.append(f"{entry_where}: 俗字 should not equal its etymon")
                if expression.get("register") not in REGISTERS:
                    errors.append(f"{entry_where}: unknown register '{expression.get('register')}'")
                if expression.get("status") not in STATUSES:
                    errors.append(f"{entry_where}: unknown status '{expression.get('status')}'")
                romanization = expression.get("romanization")
                if romanization is not None:
                    need(romanization, f"{entry_where}.romanization", {"scheme": str, "text": str})
                check_confidence(expression, entry_where)
                check_sources(expression, entry_where)
        check_unique(self.concepts, "slug", "concepts")

        for topic in self.topics:
            where = f"topic {topic.get('slug')}"
            need(topic, where, {"slug": str, "title": str, "summary": str, "body": list, "concepts": list})
            for slug in topic.get("concepts", []):
                if slug not in self.concept_lookup:
                    errors.append(f"{where}: unknown concept '{slug}'")
            check_confidence(topic, where)
            check_sources(topic, where)
        check_unique(self.topics, "slug", "topics")

        return errors


knowledge_base = KnowledgeBase()
