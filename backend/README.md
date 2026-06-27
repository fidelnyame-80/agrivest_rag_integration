# AgriVest Backend

Production RAG flow:

1. Put PDF knowledge files in `backend/documents`.
2. Configure `.env` from `.env.example`.
3. Run `bun run ingest` to create/update vectors in Pinecone.
4. Run `bun run start`.

Useful endpoints:

- `GET /health` checks service health.
- `GET /knowledge-index` shows index status and whether it is stale.
- `POST /knowledge-index/rebuild` rebuilds embeddings after document changes.
- `POST /chat` retrieves relevant chunks and answers with grounded context.

For production deploys, run `bun run ingest` during release. The chat route requires a current index and will not rebuild it during a user request.

Production environment variables:

- `NVIDIA_API_KEY`
- `PINECONE_API_KEY`
- `PINECONE_INDEX_NAME`
- `CORS_ORIGIN`
- `ADMIN_API_KEY`

## Render Deployment

In Render, choose `New` -> `Web Service`.

Use these settings:

- Repository: your AgriVest GitHub repo
- Root Directory: `backend`
- Runtime: `Node`
- Build Command: `bun install --frozen-lockfile`
- Start Command: `bun run start`
- Health Check Path: `/health`

Add these environment variables in Render:

- `NODE_ENV=production`
- `PORT=5000`
- `CORS_ORIGIN=https://your-vercel-domain.vercel.app`
- `NVIDIA_API_KEY=...`
- `NVIDIA_MODEL=meta/llama-3.1-8b-instruct`
- `NVIDIA_EMBEDDING_MODEL=nvidia/nv-embedqa-e5-v5`
- `PINECONE_API_KEY=...`
- `PINECONE_INDEX_NAME=agrivest-knowledge`
- `PINECONE_NAMESPACE=knowledge`
- `PINECONE_CLOUD=aws`
- `PINECONE_REGION=us-east-1`
- `ADMIN_API_KEY=generate-a-long-random-secret`
- `RAG_TOP_K=4`
- `RAG_MIN_SCORE=0.18`
- `CHAT_MAX_TOKENS=120`

After the backend deploys, build the Pinecone index from your own terminal:

```bash
cd backend
bun run ingest
```

Or trigger the production rebuild endpoint:

```bash
curl -X POST https://your-render-backend.onrender.com/knowledge-index/rebuild \
  -H "x-admin-key: your-admin-api-key"
```

Then check:

```bash
curl https://your-render-backend.onrender.com/knowledge-index
```

The index is ready when `exists` is `true` and `stale` is `false`.

## Vercel Frontend

Set this environment variable in Vercel after the Render backend is live:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-render-backend.onrender.com
```

Set the backend `CORS_ORIGIN` to your final Vercel URL.
