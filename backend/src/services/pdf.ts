import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";

export interface ExtractedDocument {
  fileName: string;
  text: string;
}

const DOCUMENTS_DIR = path.resolve(process.cwd(), "documents");

export async function extractPdfDocuments(): Promise<ExtractedDocument[]> {
  const entries = await readdir(DOCUMENTS_DIR, { withFileTypes: true });
  const pdfFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".pdf"))
    .map((entry) => entry.name);

  const documents = await Promise.all(
    pdfFiles.map(async (fileName) => {
      const filePath = path.join(DOCUMENTS_DIR, fileName);
      const data = await readFile(filePath);
      const parser = new PDFParse({ data });

      try {
        const result = await parser.getText();

        return {
          fileName,
          text: result.text.trim(),
        };
      } finally {
        await parser.destroy();
      }
    }),
  );

  return documents;
}
