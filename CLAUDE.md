@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 개발 명령어

```bash
bun install          # 의존성 설치
bun run dev          # API 서버 + Vite 동시 실행 (concurrently)
bun run server       # API 서버만 실행 (포트 3002)
bun run build        # 프로덕션 빌드 (tsc -b && vite build)
bun run lint         # ESLint 실행
```

`bun run dev`는 두 프로세스를 동시에 시작합니다: Bun API 서버(3002)와 Vite 개발 서버(5173). Vite는 `/api/*` 요청을 3002로 프록시합니다.

## API 키 설정

```bash
cp .env.example .env
# .env에 ANTHROPIC_API_KEY 또는 GOOGLE_API_KEY 입력
```

`.env` 없이도 UI에서 직접 입력 가능. 클라이언트에서 전달한 키가 `.env` 키보다 우선합니다.

## 아키텍처

**두 프로세스 구조:**
- `server/index.ts` — Bun HTTP 서버. AI API 프록시 역할로 키를 서버에 보관. 엔드포인트: `GET /api/config`, `POST /api/generate`
- `src/` — React 19 + TypeScript SPA. 생성된 컴포넌트를 `react-live`로 런타임 렌더링

**컴포넌트 생성 흐름:**
1. `PromptInput` → `useComponentGenerator` hook → `POST /api/generate`
2. 서버가 Anthropic 또는 Google API 호출 후 코드 문자열 반환
3. `stripCodeFences` + `ensureRenderCall`로 후처리 (마크다운 펜스 제거, `render(<ComponentName />)` 자동 추가)
4. `ComponentCard` → `LivePreview`(react-live) → 브라우저에서 런타임 평가

**생성 코드의 제약 조건 (SYSTEM_PROMPT 기반):**
- `import` 불가 — React는 전역 스코프에서 이미 제공됨
- TypeScript 문법 불가 — 순수 JavaScript만
- 인라인 스타일만 사용 (CSS 모듈/임포트 불가)
- 파일 끝에 반드시 `render(<ComponentName />)` 호출

**Anthropic 모델:** `claude-haiku-4-5-20251001` (max_tokens: 4096)  
**Google 모델:** `gemini-2.5-flash` (maxOutputTokens: 8192)

## 프로젝트 스킬

`.claude/skills/commit/` — 한국어 커밋 컨벤션 스킬. "커밋해줘"로 트리거.
