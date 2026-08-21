---
name: Word
description: Builds polished, professional .docx documents -- proper headings, tables, lists, and page setup for reports, letters, memos, and templates.
version: 1.0.0
author: Siduslabs
tags: [docx, word, document, report, memo, document-creation]
category: Document Creation
---

You create, edit, and read Word (.docx) documents. A .docx is a ZIP archive of XML, but you rarely touch that XML directly -- pick the right tool for the job:

- **New document from scratch** -- write a `docx`-generation script.
- **Editing an existing document** -- unzip, edit `word/document.xml` directly, rezip. A docx-generation library cannot open existing files.
- **Reading content** -- convert to markdown/plaintext rather than parsing the XML by hand.

Build with a working script, not by describing the document in prose -- the file is the deliverable.

## Building the document

- **Page size defaults to A4.** If the target is US Letter, set that explicitly -- don't assume the library default matches the audience.
- **Landscape orientation**: pass portrait dimensions and set the orientation flag; the library swaps the dimensions internally, so swapping them yourself produces the wrong page.
- **Tables need width set in two places**: on the table itself and on every individual cell, in matching units. Percentage-based widths render inconsistently across viewers -- use fixed units. Column widths must sum to the table width.
- **Table shading**: use a "clear" fill type, not "solid" -- solid renders as a black cell.
- **Lists**: never type a literal bullet character into the text -- configure a real bullet-list style so Word treats it as a list, not a paragraph that happens to start with a dot.
- **Images**: always declare the image type explicitly when inserting.
- **Page breaks** must live inside a paragraph, not floating on their own.
- **Never use a literal newline character** to separate lines -- each line is its own paragraph element.
- **Table of contents**: only headings using the built-in heading styles will populate a TOC. Custom-styled headings need their outline level set explicitly, or they're invisible to the TOC.
- **Don't fake a horizontal rule with a one-row table** -- use a paragraph border instead.
- **Right-aligned text on the same line as left-aligned text** (e.g. dot-leader tables of contents, letterhead dates): use a positional tab with a dot leader, not literal periods or space-padding to fake alignment.

See `references/docx-reference.md` for tracked-changes and comment mechanics in detail.

## Structure standards

- Use real heading levels (Heading 1, Heading 2, ...) for section structure -- this is what makes navigation panes, TOCs, and styles work correctly, and it signals document structure to anyone editing it later.
- Keep a consistent visual system: one heading font pairing, one body font, one accent color, applied the same way throughout.
- Headers and footers for anything more than a one-page document -- page numbers at minimum; a running title or author line for longer reports.
- Use tables for genuinely tabular data only; use headings and paragraphs for narrative structure, not tables-as-layout.
- For contracts, letters, and other documents with legal or formal weight, keep formatting conservative: safe, universally-available fonts, minimal color, generous margins.

## Editing existing documents

- Legacy `.doc` files must be converted to `.docx` before editing.
- Word fragments text across many runs internally (spell-check markers, revision history), so a phrase visible on the page often doesn't exist as one contiguous string in the XML -- merge adjacent identically-formatted runs before searching, or the find will silently miss text that's actually there.
- **Tracked changes**: wrap insertions and deletions in the correct tracked-change elements with author, date, and ID attributes -- editing text directly without those markers is invisible in the tracked-changes view even though the content changed, which defeats the point of tracking. Validate specifically for this after any redline pass.
- **Comments** require several cross-linked XML parts (the comment content, its metadata, and its anchor in the document body) -- use a script or helper that keeps all of them consistent rather than adding one file by hand.

## Verify before delivery

Render the document to an image per page and actually look at it:

- Check for overflow, awkward page breaks (a heading stranded alone at the bottom of a page, a list item split oddly across pages), and any leftover placeholder text.
- Confirm the TOC (if present) matches the actual heading structure.
- If tracked changes were involved, validate that every edit is properly wrapped -- an un-tracked change is a correctness bug, not a style nitpick.

Fix what you find, re-render, and stop once it's clean.
