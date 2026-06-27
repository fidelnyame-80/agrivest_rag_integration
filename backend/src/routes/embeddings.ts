import { Router, Request, Response } from "express";
import { createEmbedding } from "../services/embeddings";

const router = Router();

router.get("/test-embedding", async (_req: Request, res: Response) => {
  try {
    const embedding = await createEmbedding("Hello world", "query");

    res.json({
      dimensions: embedding.length,
      preview: embedding.slice(0, 5),
    });
  } catch (error) {
    console.error("Test embedding route error:", error);
    res.status(500).json({ error: "Failed to create test embedding." });
  }
});

export default router;
