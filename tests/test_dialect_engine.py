from __future__ import annotations

from app import create_app
from dialect_engine import DialectEngine


engine = DialectEngine()


def test_identify_cantonese_sample_returns_guangzhou_family() -> None:
    result = engine.identify("我冇带钥匙，食咗饭未啊？")
    assert result["possible_regions"]
    assert result["possible_regions"][0]["dialect_family"] == "粤语"
    assert any("冇" in feature["name"] or "否定式" in feature["name"] for feature in result["features"])


def test_identify_wu_sample_returns_shanghai() -> None:
    result = engine.identify("侬哪能现在才来，阿拉等了交关久。")
    assert result["possible_regions"][0]["region"] == "上海"
    assert any("侬" in feature["name"] or "人称代词系统独特" == feature["name"] for feature in result["features"])


def test_identify_minnan_sample_returns_learning_cards() -> None:
    result = engine.identify("歹势啦，我袂晓按怎做。")
    assert result["possible_regions"][0]["dialect_family"] == "闽南语"
    assert len(result["learning_cards"]) >= 3


def test_api_identify_endpoint() -> None:
    app = create_app()
    client = app.test_client()

    response = client.post("/api/identify", json={"text": "你搁这儿嘎哈呢？"})
    assert response.status_code == 200
    payload = response.get_json()
    assert payload is not None
    assert payload["possible_regions"][0]["dialect"] == "东北话"
    assert payload["features"]


def test_api_dialects_endpoint_lists_families() -> None:
    app = create_app()
    client = app.test_client()

    response = client.get("/api/dialects")
    assert response.status_code == 200
    payload = response.get_json()
    assert isinstance(payload, list)
    assert any(item["name"] == "粤语" for item in payload)
    assert any(item["dialects"] for item in payload)


def test_api_learning_endpoint_for_hakka() -> None:
    app = create_app()
    client = app.test_client()

    response = client.get("/api/learning/hakkahua")
    assert response.status_code == 200
    payload = response.get_json()
    assert payload is not None
    assert payload["cards"][0]["title"].startswith("客家话")
