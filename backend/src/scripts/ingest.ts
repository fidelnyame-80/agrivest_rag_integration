import "dotenv/config";
import { buildKnowledgeIndex, getIndexSummary } from "../services/vectorStore";

const summaryBefore = await getIndexSummary();
console.log("Knowledge index before ingest:", summaryBefore);

const index = await buildKnowledgeIndex();
const summaryAfter = await getIndexSummary();

console.log("Knowledge index built:", {
  chunkCount: summaryAfter.chunkCount,
  embeddingModel: summaryAfter.embeddingModel,
  updatedAt: summaryAfter.updatedAt,
  vectorDatabase: summaryAfter.vectorDatabase,
  indexName: index.indexName,
  namespace: index.namespace,
});
