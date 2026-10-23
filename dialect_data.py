"""Compatibility layer: dialect data now lives in ``data/`` and is loaded by ``knowledge_base``."""

from __future__ import annotations

from knowledge_base import knowledge_base

DIALECT_FAMILIES = knowledge_base.families
DIALECTS = knowledge_base.dialects
DIALECT_LOOKUP = knowledge_base.dialect_lookup
DIALECT_NAME_LOOKUP = knowledge_base.dialect_name_lookup
