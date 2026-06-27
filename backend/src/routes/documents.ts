import { Router, Request, Response } from "express";
import { extractPdfDocuments } from "../services/pdf";
import { chunkText } from "../services/chunker";
import { buildKnowledgeIndex, getIndexSummary } from "../services/vectorStore";

const router = Router();

router.get("/documents", async (_req: Request, res: Response) => {
  try {
    const documents = await extractPdfDocuments();

    res.json({
      count: documents.length,
      documents: documents.map((document) => ({
        fileName: document.fileName,
        chunkCount: chunkText(document.text).length,
        textPreview: document.text.slice(0, 300),
      })),
    });
  } catch (error) {
    console.error("Documents route error:", error);
    res.status(500).json({ error: "Failed to extract PDF documents." });
  }
});

router.get("/chunks", async (_req: Request, res: Response) => {
  try {
    const indexStatus = await getIndexSummary();

    if (!indexStatus.exists) {
      return res.status(404).json({ error: "Knowledge index has not been built." });
    }

    res.json({
      totalChunks: indexStatus.chunkCount,
      message: "Chunks are stored in Pinecone. Use /chat to retrieve relevant chunks.",
    });
  } catch (error) {
    console.error("Chunks route error:", error);
    res.status(500).json({ error: "Failed to chunk PDF documents." });
  }
});

router.get("/knowledge-index", async (_req: Request, res: Response) => {
  try {
    res.json(await getIndexSummary());
  } catch (error) {
    console.error("Knowledge index summary route error:", error);
    res.status(500).json({ error: "Failed to read knowledge index status." });
  }
});

function isAdminRequest(req: Request): boolean {
  const adminApiKey = process.env.ADMIN_API_KEY;

  if (!adminApiKey) {
    return process.env.NODE_ENV !== "production";
  }

  return req.header("x-admin-key") === adminApiKey || req.header("authorization") === `Bearer ${adminApiKey}`;
}

router.post("/knowledge-index/rebuild", async (req: Request, res: Response) => {
  try {
    if (!isAdminRequest(req)) {
      return res.status(401).json({ error: "Unauthorized." });
    }

    await buildKnowledgeIndex();
    const summary = await getIndexSummary();

    res.json({
      chunkCount: summary.chunkCount,
      embeddingModel: summary.embeddingModel,
      updatedAt: summary.updatedAt,
      vectorDatabase: summary.vectorDatabase,
      indexName: summary.indexName,
    });
  } catch (error) {
    console.error("Knowledge index rebuild route error:", error);
    res.status(500).json({ error: "Failed to rebuild knowledge index." });
  }
});

export default router;
