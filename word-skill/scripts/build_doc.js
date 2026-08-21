/**
 * Starter script for building a .docx document with docx-js.
 * Copy this, swap in real content, and follow the gotchas noted inline.
 *
 * Usage: node build_doc.js
 * Requires: docx (npm install docx)
 */

const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell,
  WidthType, ShadingType, AlignmentType, Header, Footer, PageNumber,
} = require("docx");

const PRIMARY = "1E2761";
const MUTED = "6B7280";
const FONT = "Calibri";
const HEAD_FONT = "Cambria";

const doc = new Document({
  sections: [
    {
      properties: {
        page: {
          // US Letter -- the library defaults to A4, set this explicitly
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 }, // 1" margins
        },
      },
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [new TextRun({ text: "DOCUMENT TITLE", font: FONT, size: 16, color: MUTED, bold: true })],
            }),
          ],
        }),
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: "Page ", font: FONT, size: 16, color: MUTED }),
                new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 16, color: MUTED }),
                new TextRun({ text: " of ", font: FONT, size: 16, color: MUTED }),
                new TextRun({ children: [PageNumber.TOTAL_PAGES], font: FONT, size: 16, color: MUTED }),
              ],
            }),
          ],
        }),
      },
      children: [
        // Use real heading styles -- required for TOC and navigation to work
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          children: [new TextRun({ text: "Section Title", font: HEAD_FONT, bold: true, color: PRIMARY })],
        }),
        new Paragraph({
          spacing: { after: 200, line: 300 },
          children: [new TextRun({ text: "Body text goes in its own paragraph -- never join lines with a literal newline character.", font: FONT, size: 22 })],
        }),

        // Table: width must be set on the table AND every cell, in matching units
        new Table({
          width: { size: 9000, type: WidthType.DXA },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  shading: { type: ShadingType.CLEAR, fill: "F4F6FB" }, // CLEAR, never SOLID
                  children: [new Paragraph({ children: [new TextRun({ text: "Label", bold: true, font: FONT, size: 20 })] })],
                }),
                new TableCell({
                  width: { size: 4500, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: "Value", font: FONT, size: 20 })] })],
                }),
              ],
            }),
          ],
        }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  require("fs").writeFileSync("output.docx", buf);
  console.log("Wrote output.docx -- now render it to images and check every page.");
});
