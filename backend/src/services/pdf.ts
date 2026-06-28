import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PDFParse } from "pdf-parse";

export interface ExtractedDocument {
  fileName: string;
  text: string;
}

const SERVICE_DIR = path.dirname(fileURLToPath(import.meta.url));
const DOCUMENTS_DIR_CANDIDATES = [
  path.resolve(process.cwd(), "documents"),
  path.resolve(process.cwd(), "backend", "documents"),
  path.resolve(SERVICE_DIR, "../../documents"),
];

async function getDocumentsDir(): Promise<string> {
  for (const documentsDir of DOCUMENTS_DIR_CANDIDATES) {
    try {
      await access(documentsDir);
      return documentsDir;
    } catch {
      // Try the next deployment layout.
    }
  }

  throw new Error(
    `Documents directory not found. Checked: ${DOCUMENTS_DIR_CANDIDATES.join(", ")}`,
  );
}

export async function extractPdfDocuments(): Promise<ExtractedDocument[]> {
  const documentsDir = await getDocumentsDir();
  const entries = await readdir(documentsDir, { withFileTypes: true });
  const pdfFiles = entries
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".pdf"))
    .map((entry) => entry.name);

  const documents = await Promise.all(
    pdfFiles.map(async (fileName) => {
      const filePath = path.join(documentsDir, fileName);
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
