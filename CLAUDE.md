# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project purpose

An educational/presentation Angular 20 app that demonstrates the modern render-lifecycle APIs: `afterNextRender`, `afterEveryRender`, `afterRenderEffect`, and `effect` — plus a comparison with the traditional `ngOnInit` / `ngAfterViewInit` / etc. lifecycle hooks. The deliverable is a single-route interactive presentation served from `apps/main-app`, backed by long-form markdown guides at the repo root (`AFTER_RENDER_APIS.md`, `LIFECYCLE_HOOKS_AND_RENDERER.md`, `CHEAT_SHEET.md`, `PRESENTATION_GUIDE.md`, `SUMMARY.md`).

When asked to add a new demo or example, the work almost always belongs in `apps/main-app/src/app/demos/` and needs to be linked from `presentation.ts` (the top-level presentation component routed at `''`).

## Commands

This is an Nx workspace with a single app (`main-app`). Top-level `package.json` has **no scripts** — invoke Nx directly.

```sh
# Dev server (http://localhost:4200)
npx nx serve main-app

# Production build → dist/apps/main-app/browser
npx nx build main-app

# Lint
npx nx lint main-app

# All tests (vitest, jsdom, runs once — watch is disabled in vite.config.mts)
npx nx test main-app

# Single test file
npx nx test main-app -- src/app/app.spec.ts

# Filter by test name (vitest CLI flags pass through after `--`)
npx nx test main-app -- -t "should render"

# Watch mode (override the config's watch:false)
npx nx test main-app -- --watch
```

Nx caches `build`, `lint`, and `test` per `nx.json`. The Angular dev server is configured as a continuous target.

## Architecture

**Single-app Nx monorepo, but with only one project.** Don't add libraries under a `libs/` directory unless the user explicitly asks — the existing structure deliberately keeps everything inside `apps/main-app` so the presentation reads top-to-bottom.

**Routing is intentionally flat.** `app.routes.ts` has exactly one route (`''` → `PresentationComponent`). The "presentation" is one long scrollable component (`demos/presentation.ts`) that embeds each demo component (`after-next-render-demo.ts`, `after-every-render-demo.ts`, `after-render-effect-demo.ts`, `effect-demo.ts`, `lifecycle-comparison-demo.ts`) as a child. New demos should follow this pattern: a standalone component in `demos/`, imported and rendered by `presentation.ts`.

**Build/test stack:**
- Builder: `@angular/build:application` (the new esbuild-based Angular builder), not the legacy webpack builder.
- Test runner: **Vitest** via `@analogjs/vitest-angular` and `@nx/vitest`, not Karma/Jasmine. Test setup file is `apps/main-app/src/test-setup.ts`. Specs live next to source as `*.spec.ts`.
- Zone.js is still in the polyfills list and `provideZoneChangeDetection({ eventCoalescing: true })` is configured in `app.config.ts` — the app is not zoneless. Be deliberate if changing this; the demos rely on the standard render lifecycle.

**Angular version & conventions.** Angular 20.3 (`package.json`). Standalone components are the default — there are no NgModules in `apps/`. The `~/.claude/CLAUDE.md` global Angular conventions (signal queries, `inject()` everywhere, new `@if`/`@for`/`@switch` control flow, no `:host` wrapper, single-dash class names, logical CSS properties, `componentRef.setInput()` for dynamic creation, four-file component generation) apply to every file in this repo — convert any legacy pattern you encounter while editing, don't leave files half-migrated. The demos are the canonical reference for "modern Angular" being taught here, so they must exemplify these conventions.

## Notes for edits

- The markdown guides at the repo root are content the user has authored for the presentation — treat them as source-of-truth narrative, not auto-generated docs. Update them in lockstep with code changes when the API surface or examples shift, but don't rewrite them stylistically without being asked.
- `dist/` is a build artifact and `node_modules/` is large — don't grep across them.
- There is no e2e setup (`e2eTestRunner: "none"` in `nx.json`).
