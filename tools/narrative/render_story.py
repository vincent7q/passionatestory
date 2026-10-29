"""Render the story Markdown into the existing HTML reader shell.

Requires markdown-it-py and beautifulsoup4. No game tooling is involved.
"""

from __future__ import annotations

import argparse
import re
from pathlib import Path

from bs4 import BeautifulSoup
from markdown_it import MarkdownIt


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "design/narrative/story-draft.md"
TARGET = SOURCE.with_suffix(".html")
SECTION_IDS = (
    "story-overview", "characters", "prologue",
    "stage-one", "stage-two", "stage-three", "stage-four", "stage-five", "stage-six",
    "verdict", "ending-one", "ending-two", "ending-three",
    "review-notes", "proposal-history",
)
MARKDOWN = MarkdownIt("commonmark", {"html": True}).enable("table")


def render_section(source: str, section_id: str) -> BeautifulSoup:
    fragment = BeautifulSoup(MARKDOWN.render(source.strip()), "html.parser")
    prefix = {
        "story-overview": "overview", "review-notes": "notes", "proposal-history": "archive",
    }.get(section_id, section_id)
    for index, heading in enumerate(fragment.find_all(re.compile(r"^h[1-6]$")), 1):
        heading["id"] = f"{prefix}-heading-{index}"
        if section_id == "proposal-history":
            heading.name = f"h{min(6, int(heading.name[1]) + 2)}"
    for table in fragment.find_all("table"):
        wrapper = fragment.new_tag("div", attrs={
            "aria-label": "可左右捲動的比較表格", "class": "table-wrap",
            "role": "region", "tabindex": "0",
        })
        table.wrap(wrapper)
        for heading in table.find_all("th"):
            heading["scope"] = "col"
    return fragment


def replace_once(pattern: str, replacement, page: str) -> str:
    page, count = re.subn(pattern, replacement, page, flags=re.DOTALL)
    if count != 1:
        raise ValueError(f"Expected one reader section, found {count}: {pattern}")
    return page


def render(source: str, page: str) -> str:
    markers = [f'<a id="{section_id}"></a>' for section_id in SECTION_IDS]
    positions = [source.index(marker) for marker in markers] + [len(source)]
    if positions != sorted(positions):
        raise ValueError("Story sections must follow the reader's section order")

    for index, section_id in enumerate(SECTION_IDS):
        body = source[positions[index] + len(markers[index]):positions[index + 1]]
        fragment = render_section(body, section_id)
        escaped_id = re.escape(section_id)
        if section_id.startswith("ending-"):
            heading = fragment.find("h2").extract()
            pattern = (
                rf'(<details\b[^>]*\bid="{escaped_id}"[^>]*>)'
                r'<summary>.*?</summary><div class="disclosure-body">.*?</div></details>'
            )
            page = replace_once(pattern, lambda match: (
                match[1] + f'<summary>{heading}'
                '<span class="disclosure-icon" aria-hidden="true">+</span></summary>'
                '<div class="disclosure-body">\n' + str(fragment).lstrip() + '</div></details>'
            ), page)
        elif section_id == "proposal-history":
            pattern = (
                rf'(<details\b[^>]*\bid="{escaped_id}"[^>]*>\s*<summary>.*?</summary>'
                r'\s*<div class="archive-body prose">).*?(</div>\s*</details>)'
            )
            page = replace_once(pattern, lambda match: match[1] + str(fragment) + match[2], page)
        else:
            pattern = (
                rf'(<(section|article)\b[^>]*\bid="{escaped_id}"[^>]*>)(.*?)(</\2>)'
            )

            def replace_body(match):
                eyebrow = re.match(r'(<div class="story-eyebrow">.*?</div>)', match[3], re.DOTALL)
                return match[1] + (eyebrow[1] if eyebrow else "") + str(fragment) + match[4]

            page = replace_once(pattern, replace_body, page)

    revision = re.search(r"完整故事第[^，。\s]+稿", source).group()
    date = re.search(r"\*\*日期：\*\* (\d{4}-\d{2}-\d{2})", source).group(1)
    page = replace_once(
        r'(<span class="document-status">).*?(</span>)',
        lambda match: match[1] + revision + " · " + date.replace("-", ".") + match[2], page,
    )
    page = replace_once(
        r'(<meta name="description" content=")([^"]*)(">)',
        lambda match: match[1] + re.sub(r"完整故事第[^，。\s]+稿", revision, match[2]) + match[3], page,
    )
    return page


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Verify the reader is up to date")
    args = parser.parse_args()
    current = TARGET.read_text(encoding="utf-8")
    rendered = render(SOURCE.read_text(encoding="utf-8"), current)
    if args.check:
        if rendered != current:
            print("HTML reader is out of date. Run python tools/narrative/render_story.py")
            return 1
        print("HTML reader matches the Markdown source.")
        return 0
    TARGET.write_text(rendered, encoding="utf-8", newline="\n")
    print(f"Rendered {TARGET.relative_to(ROOT).as_posix()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
