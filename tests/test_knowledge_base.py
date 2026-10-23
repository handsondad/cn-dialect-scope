from __future__ import annotations

import json
import shutil
from pathlib import Path

from app import create_app
from knowledge_base import DATA_DIR, KnowledgeBase, knowledge_base


def test_knowledge_base_data_is_valid() -> None:
    assert knowledge_base.validate() == []


def test_validation_reports_broken_references(tmp_path: Path) -> None:
    data_dir = tmp_path / "data"
    shutil.copytree(DATA_DIR, data_dir)
    concept_path = data_dir / "concepts" / "chi.json"
    concept = json.loads(concept_path.read_text(encoding="utf-8"))
    concept["expressions"][0]["dialect"] = "missing-dialect"
    concept["expressions"][1]["confidence"] = "certain"
    concept["expressions"][2]["sources"] = ["missing-source"]
    concept_path.write_text(json.dumps(concept, ensure_ascii=False), encoding="utf-8")

    errors = KnowledgeBase(data_dir).validate()
    assert any("unknown dialect 'missing-dialect'" in error for error in errors)
    assert any("confidence must be one of" in error for error in errors)
    assert any("unknown source 'missing-source'" in error for error in errors)


def test_every_dialect_has_point_and_classification() -> None:
    for dialect in knowledge_base.dialects:
        assert dialect["point"]["name"]
        assert dialect["classification"]["path"][0]


def test_concept_groups_expressions_by_family() -> None:
    concept = knowledge_base.get_concept("mei-you")
    assert concept is not None
    families = [group["family"] for group in concept["groups"]]
    assert families[0] == "官话"
    cantonese = next(group for group in concept["groups"] if group["family"] == "粤语")
    mou = cantonese["expressions"][0]
    assert mou["form"] == "冇"
    assert mou["orthography"] == "俗字"
    assert mou["etymon"] == "无"
    assert mou["romanization"] == {"scheme": "粤拼", "text": "mou5"}
    assert mou["dialect"]["point"] == "广州"


def test_search_matches_headword_dialect_form_and_romanization() -> None:
    assert knowledge_base.search("没有")["concepts"][0]["slug"] == "mei-you"
    assert knowledge_base.search("白相")["concepts"][0]["slug"] == "wan"
    assert knowledge_base.search("tsia̍h")["concepts"][0]["slug"] in {"chi", "he-cha"}
    assert knowledge_base.search("上海")["dialects"][0]["slug"] == "shanghaihua"
    assert knowledge_base.search("   ") == {"concepts": [], "dialects": [], "topics": []}


def test_api_concepts_endpoints() -> None:
    client = create_app().test_client()

    listing = client.get("/api/concepts").get_json()
    assert any(item["slug"] == "zou" for item in listing)

    detail = client.get("/api/concepts/zou")
    assert detail.status_code == 200
    payload = detail.get_json()
    assert payload["etymology"]
    assert payload["topics"][0]["slug"] == "zou-yu-xing"

    assert client.get("/api/concepts/not-a-concept").status_code == 404


def test_api_dialect_profile_and_features() -> None:
    client = create_app().test_client()

    response = client.get("/api/dialects/guangzhouhua")
    assert response.status_code == 200
    profile = response.get_json()
    assert profile["family"]["name"] == "粤语"
    assert any(item["form"] == "食" for item in profile["concept_expressions"])
    assert profile["features"]

    assert client.get("/api/dialects/unknown").status_code == 404

    features = client.get("/api/features?kind=phonology").get_json()
    assert features and all(item["kind"] == "phonology" for item in features)


def test_api_topics_search_and_sources() -> None:
    client = create_app().test_client()

    topics = client.get("/api/topics").get_json()
    assert topics
    topic = client.get(f"/api/topics/{topics[0]['slug']}").get_json()
    assert topic["concepts"] and topic["body"]
    assert client.get("/api/topics/unknown").status_code == 404

    result = client.get("/api/search", query_string={"q": "冇"}).get_json()
    assert result["concepts"][0]["slug"] == "mei-you"

    sources = client.get("/api/sources").get_json()
    assert any(item["id"] == "editorial" for item in sources)
