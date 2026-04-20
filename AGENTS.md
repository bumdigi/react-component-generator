# AGENTS.md

## Operational Commands

- Package manager: `bun` only — never npm, yarn, or pnpm
- Dev: `bun run dev` (starts API server on :3002 and Vite on :5173 concurrently)
- Server only: `bun run server`
- Build: `bun run build`
- Lint: `bun run lint`
- No test suite — verify changes manually via the dev server

## Golden Rules

**Immutable:**
- Never hardcode API keys in source files — use `.env` or client-side UI input only
- Never modify `SYSTEM_PROMPT` without updating post-processing logic (`stripCodeFences`, `ensureRenderCall`) to match
- The server is an AI API proxy only — no business logic beyond provider calls belongs in it

**Do:**
- Use `bun` native APIs in server code (`Bun.serve`, `process.env`)
- Preserve key resolution priority: client-provided key overrides env key (`clientKey || ENV_KEYS[provider]`)
- Add new AI providers by following the `Provider` type + `resolveApiKey` + `callProvider` pattern

**Don't:**
- Don't add external HTTP frameworks to the server — `Bun.serve` is sufficient
- Don't expose raw API keys in responses, logs, or error messages
- Don't add CSS frameworks to the frontend — the app uses intentionally minimal styling

## Project Context

AI-powered React component generator. Users describe a UI component in natural language; the server proxies to Anthropic or Google AI and returns a code string that is evaluated in-browser via `react-live`.

Tech Stack: React 19, TypeScript, Vite, Bun, react-live, concurrently

## Git Convention

Commits in Korean. Trigger with "커밋해줘" to use the commit skill.
Format: `type: 설명` — e.g., `feat:`, `fix:`, `style:`, `chore:`, `refactor:`

## Context Map

- **[API 서버 수정 (server/)](./server/AGENTS.md)** — Bun 서버, AI 프로바이더 추가/수정, 엔드포인트 변경 시.
- **[React SPA 수정 (src/)](./src/AGENTS.md)** — 컴포넌트, hooks, react-live 렌더링 수정 시.

## Maintenance Policy

If these rules diverge from the actual implementation, propose an update to this file as part of the change.
