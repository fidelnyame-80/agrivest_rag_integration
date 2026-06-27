import OpenAI from "openai";
import type { EmbeddingCreateParams } from "openai/resources/embeddings";

let openai: OpenAI;

export const DEFAULT_EMBEDDING_MODEL = "nvidia/nv-embedqa-e5-v5";

type NvidiaEmbeddingParams = EmbeddingCreateParams & {
  input_type: "query" | "passage";
};

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

export function getEmbeddingModel(): string {
  return process.env.NVIDIA_EMBEDDING_MODEL ?? DEFAULT_EMBEDDING_MODEL;
}

export async function createEmbedding(
  text: string,
  inputType: "query" | "passage" = "query",
): Promise<number[]> {
  if (!text.trim()) {
    throw new Error("Text is required to create an embedding");
  }

  try {
    const params: NvidiaEmbeddingParams = {
      model: getEmbeddingModel(),
      input: text,
      input_type: inputType,
    };

    const response = await getClient().embeddings.create(params);

    return response.data[0]?.embedding ?? [];
  } catch (error) {
    console.error("Embedding creation failed:", error);
    throw new Error("Failed to create embedding");
  }
}
