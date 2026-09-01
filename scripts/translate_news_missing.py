from __future__ import annotations

import re
import time
from pathlib import Path

from deep_translator import GoogleTranslator
from opencc import OpenCC

BASE = Path(r"d:\UserData\Documents\GitHub\KR-website\src\data\news\posts")
SRC = BASE / "zh-CN"
TARGETS = {"zh-TW": BASE / "zh-TW", "en": BASE / "en", "ja": BASE / "ja"}

s2t = OpenCC("s2t")

RE_FRONTMATTER = re.compile(r"^---\r?\n([\s\S]*?)\r?\n---\r?\n?", re.M)

TERM_REPLACEMENTS = {
    "zh-TW": {
        "彗星快线": "彗星快線",
        "快线": "快線",
        "A线": "A線",
        "B线": "B線",
        "C线": "C線",
        "D线": "D線",
        "E线": "E線",
        "F线": "F線",
        "快线A线": "CLE-A Line",
        "快线B线": "CLE-B Line",
        "快线C线": "CLE-C Line",
        "快线D线": "CLE-D Line",
        "快线E线": "CLE-E Line",
        "快线F线": "CLE-F Line",
        "彗星快线A线": "CLE-A Line",
        "彗星快线B线": "CLE-B Line",
        "彗星快线C线": "CLE-C Line",
        "彗星快线D线": "CLE-D Line",
        "彗星快线E线": "CLE-E Line",
        "彗星快线F线": "CLE-F Line",
    },
    "en": {
        "彗星快线": "Comet Express",
        "快线": "Express Line",
        "A线": "A Line",
        "B线": "B Line",
        "C线": "C Line",
        "D线": "D Line",
        "E线": "E Line",
        "F线": "F Line",
        "快线A线": "CLE-A Line",
        "快线B线": "CLE-B Line",
        "快线C线": "CLE-C Line",
        "快线D线": "CLE-D Line",
        "快线E线": "CLE-E Line",
        "快线F线": "CLE-F Line",
        "彗星快线A线": "CLE-A Line",
        "彗星快线B线": "CLE-B Line",
        "彗星快线C线": "CLE-C Line",
        "彗星快线D线": "CLE-D Line",
        "彗星快线E线": "CLE-E Line",
        "彗星快线F线": "CLE-F Line",
        "彗星快线A线": "CLE-A Line",
        "彗星快线B线": "CLE-B Line",
        "彗星快线C线": "CLE-C Line",
        "彗星快线D线": "CLE-D Line",
        "彗星快线E线": "CLE-E Line",
        "彗星快线F线": "CLE-F Line",
    },
    "ja": {
        "彗星快线": "彗星快線",
        "快线": "快線",
        "A线": "A線",
        "B线": "B線",
        "C线": "C線",
        "D线": "D線",
        "E线": "E線",
        "F线": "F線",
        "快线A线": "CLE-A Line",
        "快线B线": "CLE-B Line",
        "快线C线": "CLE-C Line",
        "快线D线": "CLE-D Line",
        "快线E线": "CLE-E Line",
        "快线F线": "CLE-F Line",
        "彗星快线A线": "CLE-A Line",
        "彗星快线B线": "CLE-B Line",
        "彗星快线C线": "CLE-C Line",
        "彗星快线D线": "CLE-D Line",
        "彗星快线E线": "CLE-E Line",
        "彗星快线F线": "CLE-F Line",
    },
}


def split_frontmatter(text: str):
    match = RE_FRONTMATTER.match(text)
    if not match:
        return "", text
    return match.group(1), text[match.end() :]


def parse_frontmatter(frontmatter: str):
    result: dict[str, str | list[str]] = {}
    list_key: str | None = None
    for line in frontmatter.splitlines():
        if not line.strip():
            continue
        if re.match(r"^\s*-\s+", line):
            if list_key and isinstance(result.get(list_key), list):
                result[list_key].append(line.strip()[2:].strip())
            continue
        if ":" not in line:
            continue
        key, raw_value = line.split(":", 1)
        key = key.strip()
        value = raw_value.strip().strip("'\"")
        if not key:
            continue
        if value == "":
            result[key] = []
            list_key = key
        else:
            result[key] = value
            list_key = None
    return result


def apply_term_replacements(text: str, locale: str) -> str:
    result = text
    for old, new in TERM_REPLACEMENTS[locale].items():
        result = result.replace(old, new)
    return result


def translate_chunk(chunk: str, locale: str) -> str:
    if locale == "zh-TW":
        return apply_term_replacements(s2t.convert(chunk), locale)
    if not chunk or not chunk.strip():
        return chunk
    if chunk.startswith("http") or chunk.startswith("!") or re.fullmatch(r"https?://\S+", chunk):
        return chunk
    translated = None
    for attempt in range(3):
        try:
            translator = GoogleTranslator(source="zh-CN", target=locale)
            translated = translator.translate(chunk)
            if translated:
                return apply_term_replacements(translated, locale)
        except Exception:
            time.sleep(0.8 * (attempt + 1))
            continue
    return apply_term_replacements(chunk, locale)


def translate_text(text: str, locale: str) -> str:
    if locale == "zh-TW":
        return apply_term_replacements(s2t.convert(text), locale)

    blocks = re.split(r"(\n\s*\n+)", text)
    translated_parts: list[str] = []
    buffer = ""
    for block in blocks:
        if not block:
            continue
        candidate = buffer + block
        if len(candidate.encode("utf-8")) > 2000 and buffer:
            translated_parts.append(translate_chunk(buffer, locale))
            buffer = block
        else:
            buffer = candidate
    if buffer:
        translated_parts.append(translate_chunk(buffer, locale))
    return "".join(translated_parts)


def build_frontmatter(title: str, date: str, tags: list[str], category: list[str], cover: str) -> str:
    tag_lines = "".join(f"  - {tag}\n" for tag in tags)
    category_lines = "".join(f"  - {item}\n" for item in category)
    return (
        "---\n"
        f"title: {title}\n"
        f"date: {date}\n"
        "tags:\n"
        f"{tag_lines}"
        "category:\n"
        f"{category_lines}"
        f"cover: {cover}\n"
        "---\n"
    )


def ensure_locale_dir(locale_dir: Path):
    locale_dir.mkdir(parents=True, exist_ok=True)


for locale, locale_dir in TARGETS.items():
    ensure_locale_dir(locale_dir)
    src_files = sorted(p.name for p in SRC.iterdir() if p.is_file() and p.suffix.lower() == ".md")
    existing = {p.name for p in locale_dir.iterdir() if p.is_file() and p.suffix.lower() == ".md"}
    missing = [name for name in src_files if name not in existing]
    print(f"[{locale}] missing {len(missing)} files")

    for file_name in missing:
        src_path = SRC / file_name
        text = src_path.read_text(encoding="utf-8")
        frontmatter_text, body = split_frontmatter(text)
        frontmatter = parse_frontmatter(frontmatter_text)

        title = str(frontmatter.get("title") or src_path.stem)
        date = str(frontmatter.get("date") or "")
        tags = frontmatter.get("tags")
        if isinstance(tags, str):
            tags = [tags]
        elif not isinstance(tags, list):
            tags = []
        categories = frontmatter.get("category")
        if isinstance(categories, str):
            categories = [categories]
        elif not isinstance(categories, list):
            categories = []
        cover = str(frontmatter.get("cover") or "")

        translated_title = translate_chunk(title, locale)
        translated_tags = [translate_chunk(tag, locale) for tag in tags]
        translated_categories = [translate_chunk(item, locale) for item in categories]
        translated_body = translate_text(body.strip(), locale)

        output = build_frontmatter(translated_title, date, translated_tags, translated_categories, cover)
        output += translated_body.strip() + "\n"
        dest = locale_dir / file_name
        dest.write_text(output, encoding="utf-8")
        print(f"  wrote {locale}/{file_name}")
        time.sleep(0.5)
