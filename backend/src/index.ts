import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import chatRouter from "./routes/chat";
import documentsRouter from "./routes/documents";
import embeddingsRouter from "./routes/embeddings";

const REQUIRED_ENV_VARS = ["NVIDIA_API_KEY", "PINECONE_API_KEY"];

function validateEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
  if (!process.env.CORS_ORIGIN && process.env.NODE_ENV === "production") {
    console.warn("Warning: CORS_ORIGIN is not set. All origins will be allowed.");
  }
}

validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());

const allowedOrigin = process.env.CORS_ORIGIN;
app.use(
  cors({
    origin: allowedOrigin ? allowedOrigin.split(",").map((origin) => origin.trim()) : true,
  }),
);

app.use(express.json({ limit: "1mb" }));

const chatLimiter = rateLimit({
  windowMs: 60_000,
  max: 20,
  message: { reply: "Too many requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/chat", chatLimiter);

app.get("/", (_req, res) => {
  res.json({ message: "backend is running" });
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "agrivest-backend",
    timestamp: new Date().toISOString(),
  });
});

app.use(chatRouter);
app.use(documentsRouter);
app.use(embeddingsRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function shutdown(signal: string) {
  console.log(`Received ${signal}, shutting down gracefully...`);
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });

  setTimeout(() => {
    console.error("Forced shutdown after 10s timeout");
    process.exit(1);
  }, 10_000);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
