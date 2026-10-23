from __future__ import annotations

from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from dialect_engine import engine
from knowledge_base import knowledge_base

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"


def create_app() -> Flask:
    app = Flask(__name__, static_folder=str(STATIC_DIR), static_url_path="/static")
    CORS(app)

    @app.get("/")
    def index() -> object:
        return send_from_directory(app.static_folder, "index.html")

    @app.post("/api/identify")
    def identify() -> object:
        payload = request.get_json(silent=True) or {}
        text = str(payload.get("text", ""))
        result = engine.identify(text)
        return jsonify(result)

    @app.get("/api/dialects")
    def dialects() -> object:
        return jsonify(engine.list_families())

    @app.get("/api/learning/<dialect>")
    def learning(dialect: str) -> object:
        materials = engine.get_learning_materials(dialect)
        if not materials:
            return jsonify({"error": "Dialect not found"}), 404
        return jsonify(
            {
                "dialect": dialect,
                "cards": materials,
            }
        )

    @app.get("/api/dialects/<slug>")
    def dialect_profile(slug: str) -> object:
        profile = knowledge_base.get_dialect_profile(slug)
        if not profile:
            return jsonify({"error": "Dialect not found"}), 404
        return jsonify(profile)

    @app.get("/api/concepts")
    def concepts() -> object:
        return jsonify(knowledge_base.list_concepts(request.args.get("category")))

    @app.get("/api/concepts/<slug>")
    def concept(slug: str) -> object:
        detail = knowledge_base.get_concept(slug)
        if not detail:
            return jsonify({"error": "Concept not found"}), 404
        return jsonify(detail)

    @app.get("/api/features")
    def features() -> object:
        return jsonify(knowledge_base.list_features(request.args.get("kind")))

    @app.get("/api/topics")
    def topics() -> object:
        return jsonify(knowledge_base.list_topics())

    @app.get("/api/topics/<slug>")
    def topic(slug: str) -> object:
        detail = knowledge_base.get_topic(slug)
        if not detail:
            return jsonify({"error": "Topic not found"}), 404
        return jsonify(detail)

    @app.get("/api/sources")
    def sources() -> object:
        return jsonify(knowledge_base.sources)

    @app.get("/api/search")
    def search() -> object:
        return jsonify(knowledge_base.search(request.args.get("q", "")))

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
