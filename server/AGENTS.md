# server/AGENTS.md

## Module Context

Single-file Bun HTTP server (`server/index.ts`). Proxies AI API calls from the React SPA, keeping API keys server-side. Two endpoints: `GET /api/config`, `POST /api/generate`.

## Tech Stack & Constraints

- Runtime: Bun — use `Bun.serve`, not `http.createServer`
- HTTP: native `Bun.serve` only — no Express, Hono, or other frameworks
- HTTP client: native `fetch` only — no axios or node-fetch

## Implementation Patterns

**Adding a new AI provider:**
1. Add to `Provider` type: `type Provider = 'anthropic' | 'google' | 'newprovider'`
2. Add env key to `ENV_KEYS` record
3. Implement `callNewProvider(prompt: string, apiKey: string): Promise<string>`
4. Add branch in the `POST /api/generate` handler

**Post-processing pipeline — always apply both in order:**
```
rawText → stripCodeFences() → ensureRenderCall() → return { code } to client
```

**Error response format:**
```ts
Response.json({ error: string }, { status: number, headers: CORS_HEADERS })
```
Status codes: 400 (missing key or prompt), 429 (rate limit), 503 (overload), 500 (other)

## Local Golden Rules

**Do:**
- Include `CORS_HEADERS` in every response including OPTIONS preflight
- Validate `resolvedKey` and `prompt` before calling any AI API
- Handle `finishReason === 'MAX_TOKENS'` for Google responses (throw a user-friendly Korean error)

**Don't:**
- Don't add endpoints beyond `/api/config` and `/api/generate` without clear justification
- Don't log or return the raw API key string anywhere
- Don't change `SYSTEM_PROMPT` without verifying `ensureRenderCall` regex still matches the generated component name pattern
