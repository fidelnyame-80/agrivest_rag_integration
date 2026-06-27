import OpenAI from "openai";
import { formatRetrievedContext } from "./rag";
import type { RetrievedChunk } from "./vectorStore";

let openai: OpenAI;
const DEFAULT_MODEL = "meta/llama-3.1-8b-instruct";
const SYSTEM_PROMPT = [
  "You are AgriVest Guide, a concise assistant for an agriculture investment website.",
  "Answer in 1 to 3 short sentences, under 60 words.",
  "Use plain text only. Do not use markdown, asterisks, headings, bullet lists, or numbered lists.",
  "When context is provided, answer only from that context.",
  "If the context does not answer the question, say that the AgriVest knowledge base does not include that detail and give brief general guidance.",
].join(" ");

function cleanReply(reply: string): string {
  return reply
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .trim();
}

function getClient(): OpenAI {
  if (!process.env.NVIDIA_API_KEY) {
    throw new Error("NVIDIA_API_KEY is not configured");
  }

  if (!openai) {
    openai = new OpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey: process.env.NVIDIA_API_KEY,
    });
  }
  return openai;
}

export async function askLLM(
  message: string,
  retrievedChunks: RetrievedChunk[] = [],
): Promise<string> {
  if (!message?.trim()) {
    throw new Error("Message is required");
  }

  try {
    const context = formatRetrievedContext(retrievedChunks);
    const completion = await getClient().chat.completions.create({
      model: process.env.NVIDIA_MODEL ?? DEFAULT_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: context
            ? `AgriVest context:\n${context}\n\nQuestion: ${message}`
            : message,
        },
      ],
      max_tokens: Number(process.env.CHAT_MAX_TOKENS ?? 120),
      temperature: 0.4,
    });

    return cleanReply(completion.choices[0]?.message?.content ?? "");
  } catch (error) {
    console.error("LLM call failed:", error);
    throw new Error("Failed to get response from LLM");
  }
}
