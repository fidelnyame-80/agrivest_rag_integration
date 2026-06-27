import { createEmbedding } from "./embeddings";
import { getSearchableKnowledgeIndex, RetrievedChunk, searchKnowledgeIndex } from "./vectorStore";

const DEFAULT_TOP_K = 4;

export async function retrieveContext(message: string): Promise<RetrievedChunk[]> {
  const index = await getSearchableKnowledgeIndex();
  const queryEmbedding = await createEmbedding(message, "query");

  return await searchKnowledgeIndex(index, queryEmbedding, {
    topK: Number(process.env.RAG_TOP_K ?? DEFAULT_TOP_K),
    minScore: Number(process.env.RAG_MIN_SCORE ?? 0.18),
  });
}

export function formatRetrievedContext(chunks: RetrievedChunk[]): string {
  return chunks
    .map(
      (chunk, index) =>
        `[${index + 1}] Source: ${chunk.fileName}, chunk ${chunk.index}\n${chunk.text}`,
    )
    .join("\n\n");
}
