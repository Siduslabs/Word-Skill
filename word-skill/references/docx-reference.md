# Docx Reference

Extended detail for the Word skill. Consult this for tracked changes, comments, and editing mechanics -- SKILL.md covers the summary; this covers the specifics.

## Tracked changes

- Every inserted run is wrapped in an insertion element; every deleted run in a deletion element. Both carry an author, a date, and a unique ID.
- Inside a deletion, the text element is different from a normal text run -- using the normal one there is invisible in the accepted/rejected view even though the XML is malformed.
- A **deleted paragraph mark** (the run-properties-level deletion marker on a paragraph) means "merge this paragraph into the next one." Deleting a paragraph outright is that marker *plus* a deletion wrapper around every run inside it -- not one or the other.
- Element order inside the run properties is schema-enforced; the deletion marker must come before its sibling properties, not after.
- Validate specifically for this after any redline pass: search for any changed text that isn't wrapped in an insertion or deletion element. It's easy to edit text directly by mistake, and it's invisible in the "show changes" view -- only a raw check against the original catches it.

### Accepting tracked changes

- Accepting a deleted paragraph mark should join that paragraph with the one below it, so a paragraph whose runs are *all* deleted disappears entirely rather than leaving an empty stray paragraph behind.
- Different acceptance tools handle this differently -- some never join the paragraphs, some join correctly except when the deleted paragraph is followed by an empty spacer paragraph. An empty bullet or stray blank line after accepting changes is usually an artifact of the tool used, not a defect you introduced -- check the underlying paragraph deletion markers in the XML before assuming it's a real bug.

## Comments

A comment isn't one file -- it's several cross-linked parts that all have to agree:

1. The comment's text content
2. Extended metadata (resolved/unresolved state, replies)
3. Comment IDs
4. An "extensible" part some Word versions expect
5. Relationship entries wiring these together
6. Content-type declarations registering the new parts

And separately, in the document body itself: a range-start marker, a range-end marker, and a reference marker anchoring the comment to specific text. Until those three markers are placed, the comment exists in the package but isn't visible or anchored to anything.

Use a helper that writes all of this consistently rather than adding one piece by hand -- a comment missing even one cross-linked part can make Word refuse to open the file, or silently drop the comment.

## Common structural mistakes

- Assigning `text_frame.text = "..."` style whole-paragraph replacement collapses all existing formatting (bold, color, size) down to a single unstyled run. Replace text at the run level, not the paragraph level, if you need to preserve formatting.
- Round-tripping the document XML through a generic tree/XML library that isn't namespace-aware often rewrites namespace prefixes and corrupts the file, even though the content looks unchanged. Use an XML approach that preserves namespaces exactly.
- A duplicated table or section still references the same styles and numbering definitions as its source -- edits to shared numbering can affect both unexpectedly if you're not careful about which definitions are actually shared versus copied.
