# src/AGENTS.md

## Module Context

React 19 SPA that renders AI-generated component code at runtime via `react-live`. The central constraint: all code strings passed to `LiveProvider` must be valid for in-browser JSX evaluation — no imports, no TypeScript, inline styles only.

## Tech Stack & Constraints

- React 19 with hooks — no class components
- `react-live` for runtime JSX evaluation: `LiveProvider` + `LivePreview` + `LiveError`
- No CSS framework, no CSS modules — inline styles only for this app's own UI components
- State management: React built-in hooks only (no Redux, Zustand, etc.)

## Implementation Patterns

**`GeneratedComponent` type** (defined in `src/types/index.ts`):
```ts
{ id: string; prompt: string; code: string; createdAt: Date }
```
ID format: `` `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` ``

**react-live scope:** `React` is the only injected global. Generated code must call `React.useState`, `React.useEffect`, etc. — never destructured imports.

**Component hierarchy:**
```
App
├── PromptInput          (user input, provider selection, API key entry)
└── ComponentCard[]      (one per generated result)
    ├── LivePreview      (react-live evaluation + error overlay)
    └── CodeView         (syntax-highlighted code display)
```

**All generation state** lives in `useComponentGenerator` hook — do not duplicate state elsewhere.

## Testing Strategy

No automated tests. Verify via `bun run dev` and manual browser testing.
To test LivePreview: submit a prompt, confirm the component renders without a `LiveError` overlay.

## Local Golden Rules

**Do:**
- Use `useCallback` for all functions returned from hooks (established pattern)
- Render `LiveError` when evaluation fails — never silently swallow react-live errors
- Keep `useComponentGenerator` as the single source of truth for components list, loading, and error state

**Don't:**
- Don't pass `import` statements in the code string to `LiveProvider` — evaluation will fail
- Don't pass TypeScript syntax (type annotations, interfaces, generics, `as` casts) to `LiveProvider`
- Don't add new global state libraries — the hook pattern is sufficient for this app's scope
