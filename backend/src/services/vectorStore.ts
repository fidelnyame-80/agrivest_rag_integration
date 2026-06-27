import crypto from "node:crypto";
import { chunkText } from "./chunker";
import { createEmbedding, getEmbeddingModel } from "./embeddings";
import { extractPdfDocuments } from "./pdf";

const DEFAULT_TOP_K = 4;
const DEFAULT_MIN_SCORE = 0.18;
const DEFAULT_INDEX_NAME = "agrivest-knowledge";
const DEFAULT_NAMESPACE = "knowledge";
const DEFAULT_CLOUD = "aws";
const DEFAULT_REGION = "us-east-1";
const META_VECTOR_ID = "__agrivest_meta";

interface PineconeIndexDescription {
  name: string;
  dimension: number;
  metric: string;
  host: string;
  status?: {
    ready?: boolean;
  };
}

interface PineconeVector {
  id: string;
  values: number[];
  metadata: Record<string, string | number | boolean>;
}

interface PineconeFetchResponse {
  vectors?: Record<
    string,
    {
      id: string;
      metadata?: Record<string, string | number | boolean>;
    }
  >;
}

interface PineconeQueryResponse {
  matches?: Array<{
    id: string;
    score?: number;
    metadata?: Record<string, string | number | boolean>;
  }>;
}

interface PineconeStatsResponse {
  totalVectorCount?: number;
  namespaces?: Record<string, { vectorCount?: number }>;
}

export interface KnowledgeIndex {
  host: string;
  indexName: string;
  namespace: string;
  dimension: number;
}

export interface RetrievedChunk {
  id: string;
  fileName: string;
  index: number;
  text: string;
  score: number;
}

export interface IndexSummary {
  exists: boolean;
  stale: boolean;
  documentCount: number;
  chunkCount: number;
  embeddingModel: string;
  updatedAt?: string;
  sourceHash: string;
  vectorDatabase: "pinecone";
  indexName: string;
  namespace: string;
}

let cachedIndex: KnowledgeIndex | null = null;

function getPineconeApiKey(): string {
  const apiKey = process.env.PINECONE_API_KEY;

  if (!apiKey) {
    throw new Error("PINECONE_API_KEY is not configured");
  }

  return apiKey;
}

function getIndexName(): string {
  return process.env.PINECONE_INDEX_NAME ?? DEFAULT_INDEX_NAME;
}

function getNamespace(): string {
  return process.env.PINECONE_NAMESPACE ?? DEFAULT_NAMESPACE;
}

function hashText(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

async function getSourceHash(): Promise<string> {
  const documents = await extractPdfDocuments();
  const payload = documents
    .map((document) => `${document.fileName}:${hashText(document.text)}`)
    .sort()
    .join("|");

  return hashText(`${getEmbeddingModel()}|${payload}`);
}

async function pineconeControlRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`https://api.pinecone.io${path}`, {
    ...init,
    headers: {
      "Api-Key": getPineconeApiKey(),
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Pinecone control request failed: ${response.status} ${body}`);
  }

  return (await response.json()) as T;
}

async function pineconeDataRequest<T>(
  host: string,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`https://${host}${path}`, {
    ...init,
    headers: {
      "Api-Key": getPineconeApiKey(),
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Pinecone data request failed: ${response.status} ${body}`);
  }

  return (await response.json()) as T;
}

async function describePineconeIndex(): Promise<PineconeIndexDescription | null> {
  try {
    return await pineconeControlRequest<PineconeIndexDescription>(
      `/indexes/${encodeURIComponent(getIndexName())}`,
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      return null;
    }

    throw error;
  }
}

async function createPineconeIndex(dimension: number): Promise<void> {
  await pineconeControlRequest("/indexes", {
    method: "POST",
    body: JSON.stringify({
      name: getIndexName(),
      dimension,
      metric: "cosine",
      spec: {
        serverless: {
          cloud: process.env.PINECONE_CLOUD ?? DEFAULT_CLOUD,
          region: process.env.PINECONE_REGION ?? DEFAULT_REGION,
        },
      },
    }),
  });
}

async function waitForReadyIndex(): Promise<PineconeIndexDescription> {
  const maxAttempts = 30;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const index = await describePineconeIndex();

    if (index?.host && index.status?.ready !== false) {
      return index;
    }

    await new Promise((resolve) => setTimeout(resolve, 2_000));
  }

  throw new Error("Pinecone index was not ready in time");
}

async function ensurePineconeIndex(dimension: number): Promise<KnowledgeIndex> {
  const existingIndex = await describePineconeIndex();
  const index = existingIndex ?? (await createPineconeIndex(dimension), await waitForReadyIndex());

  if (index.dimension !== dimension) {
    throw new Error(
      `Pinecone index dimension mismatch. Expected ${dimension}, found ${index.dimension}.`,
    );
  }

  cachedIndex = {
    host: index.host,
    indexName: index.name,
    namespace: getNamespace(),
    dimension: index.dimension,
  };

  return cachedIndex;
}

async function getMeta(index: KnowledgeIndex): Promise<Record<string, string | number | boolean> | null> {
  const response = await pineconeDataRequest<PineconeFetchResponse>(
    index.host,
    `/vectors/fetch?ids=${encodeURIComponent(META_VECTOR_ID)}&namespace=${encodeURIComponent(index.namespace)}`,
  );

  return response.vectors?.[META_VECTOR_ID]?.metadata ?? null;
}

async function upsertVectors(index: KnowledgeIndex, vectors: PineconeVector[]): Promise<void> {
  const batchSize = 100;

  for (let start = 0; start < vectors.length; start += batchSize) {
    const batch = vectors.slice(start, start + batchSize);

    await pineconeDataRequest(index.host, "/vectors/upsert", {
      method: "POST",
      body: JSON.stringify({
        namespace: index.namespace,
        vectors: batch,
      }),
    });
  }
}

export async function loadKnowledgeIndex(): Promise<KnowledgeIndex | null> {
  if (cachedIndex) {
    return cachedIndex;
  }

  const index = await describePineconeIndex();

  if (!index?.host) {
    return null;
  }

  cachedIndex = {
    host: index.host,
    indexName: index.name,
    namespace: getNamespace(),
    dimension: index.dimension,
  };

  return cachedIndex;
}

export async function buildKnowledgeIndex(): Promise<KnowledgeIndex> {
  const documents = await extractPdfDocuments();
  const vectors: PineconeVector[] = [];
  let dimension: number | null = null;
  let chunkCount = 0;

  for (const document of documents) {
    const documentChunks = chunkText(document.text);

    for (const chunk of documentChunks) {
      const embedding = await createEmbedding(chunk.text, "passage");
      dimension ??= embedding.length;

      vectors.push({
        id: `${document.fileName}:${chunk.index}`,
        values: embedding,
        metadata: {
          kind: "chunk",
          fileName: document.fileName,
          chunkIndex: chunk.index,
          text: chunk.text,
          embeddingModel: getEmbeddingModel(),
        },
      });
      chunkCount += 1;
    }
  }

  if (!dimension) {
    throw new Error("No document chunks were available to index.");
  }

  const index = await ensurePineconeIndex(dimension);
  const now = new Date().toISOString();
  const sourceHash = await getSourceHash();

  vectors.push({
    id: META_VECTOR_ID,
    values: [0.000001, ...Array.from({ length: dimension - 1 }, () => 0)],
    metadata: {
      kind: "meta",
      sourceHash,
      embeddingModel: getEmbeddingModel(),
      updatedAt: now,
      documentCount: documents.length,
      chunkCount,
    },
  });

  await upsertVectors(index, vectors);

  return index;
}

export async function getSearchableKnowledgeIndex(): Promise<KnowledgeIndex> {
  const index = await loadKnowledgeIndex();
  const sourceHash = await getSourceHash();

  if (!index) {
    throw new Error("Knowledge index has not been built. Run bun run ingest first.");
  }

  const meta = await getMeta(index);

  if (!meta) {
    throw new Error("Knowledge index metadata is missing. Rebuild it before serving chat answers.");
  }

  if (meta.sourceHash !== sourceHash || meta.embeddingModel !== getEmbeddingModel()) {
    throw new Error("Knowledge index is stale. Rebuild it before serving chat answers.");
  }

  return index;
}

export async function getIndexSummary(): Promise<IndexSummary> {
  const sourceHash = await getSourceHash();
  const index = await loadKnowledgeIndex();
  const meta = index ? await getMeta(index) : null;

  return {
    exists: Boolean(index && meta),
    stale: !meta || meta.sourceHash !== sourceHash || meta.embeddingModel !== getEmbeddingModel(),
    documentCount: Number(meta?.documentCount ?? 0),
    chunkCount: Number(meta?.chunkCount ?? 0),
    embeddingModel: String(meta?.embeddingModel ?? getEmbeddingModel()),
    updatedAt: typeof meta?.updatedAt === "string" ? meta.updatedAt : undefined,
    sourceHash,
    vectorDatabase: "pinecone",
    indexName: getIndexName(),
    namespace: getNamespace(),
  };
}

export async function searchKnowledgeIndex(
  index: KnowledgeIndex,
  queryEmbedding: number[],
  options: { topK?: number; minScore?: number } = {},
): Promise<RetrievedChunk[]> {
  const topK = options.topK ?? DEFAULT_TOP_K;
  const minScore = options.minScore ?? DEFAULT_MIN_SCORE;
  const response = await pineconeDataRequest<PineconeQueryResponse>(index.host, "/query", {
    method: "POST",
    body: JSON.stringify({
      namespace: index.namespace,
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
      filter: {
        kind: { "$eq": "chunk" },
      },
    }),
  });

  return (response.matches ?? [])
    .filter((match) => (match.score ?? 0) >= minScore)
    .map((match) => ({
      id: match.id,
      fileName: String(match.metadata?.fileName ?? "unknown"),
      index: Number(match.metadata?.chunkIndex ?? 0),
      text: String(match.metadata?.text ?? ""),
      score: match.score ?? 0,
    }));
}
