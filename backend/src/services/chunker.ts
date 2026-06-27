export interface TextChunk {
  text: string;
  index: number;
}

export interface ChunkOptions {
  chunkSize?: number;
  overlap?: number;
}

const DEFAULT_CHUNK_SIZE = 800;
const DEFAULT_OVERLAP = 150;

export function chunkText(text: string, options: ChunkOptions = {}): TextChunk[] {
  const chunkSize = options.chunkSize ?? DEFAULT_CHUNK_SIZE;
  const overlap = options.overlap ?? DEFAULT_OVERLAP;

  if (chunkSize <= 0) {
    throw new Error("chunkSize must be greater than 0");
  }

  if (overlap < 0 || overlap >= chunkSize) {
    throw new Error("overlap must be greater than or equal to 0 and less than chunkSize");
  }

  const trimmedText = text.trim();
  if (!trimmedText) {
    return [];
  }

  const chunks: TextChunk[] = [];
  let start = 0;

  while (start < trimmedText.length) {
    const end = Math.min(start + chunkSize, trimmedText.length);
    const chunk = trimmedText.slice(start, end).trim();

    if (chunk) {
      chunks.push({
        text: chunk,
        index: chunks.length,
      });
    }

    if (end === trimmedText.length) {
      break;
    }

    start = end - overlap;
  }

  return chunks;
}
