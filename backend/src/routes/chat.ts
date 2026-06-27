import { Router, Request, Response } from "express";
import { askLLM } from "../services/llm";
import { retrieveContext } from "../services/rag";

const router = Router();
const MAX_MESSAGE_LENGTH = 1_000;

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ reply: "Message is required." });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ reply: "Message is too long." });
    }

    const retrievedChunks = await retrieveContext(message);
    const reply = await askLLM(message, retrievedChunks);

    res.json({
      reply,
      sources: retrievedChunks.map((chunk) => ({
        fileName: chunk.fileName,
        chunkIndex: chunk.index,
        score: Number(chunk.score.toFixed(4)),
      })),
    });
  } catch (error) {
    console.error("Chat route error:", error);

    if (error instanceof Error && error.message.includes("Knowledge index")) {
      return res.status(503).json({
        reply: "The AgriVest knowledge base is not ready yet. Please rebuild the knowledge index and try again.",
      });
    }

    res.status(500).json({ reply: "Sorry, something went wrong." });
  }
});

export default router;
