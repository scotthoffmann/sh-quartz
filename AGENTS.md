# Repository Guidelines

## Project Structure & Module Organization

- `quartz/` hosts the TypeScript engine: CLI launchers (`bootstrap-*.mjs`), processors, plugins, and `util/` helpers; start feature work here.
- `content/` stores markdown notes fed into builds, while `public/` contains static assets copied as-is; avoid manual edits to generated output.
- `docs/` is produced by the docs build pipeline; treat it like a published preview rather than source.
- Config entrypoints live in `quartz.config.ts` (behavior) and `quartz.layout.ts` (presentation). Co-located tests such as `quartz/util/path.test.ts` keep coverage near the code they exercise.

## Build, Test, and Development Commands

- `npm run quartz -- dev` launches the watcher and local preview server using your active `quartz.config.ts`.
- `npm run quartz -- build` compiles the static site to the configured destination (defaults to `public/`); add `--serve` to inspect the result.
- `npm run docs` rebuilds and serves the documentation garden from `docs/`.
- `npm run check` executes `tsc --noEmit` plus `prettier --check`; run this before opening a PR.
- `npm test` runs the TSX test harness; focus on a single file via `npm test quartz/util/path.test.ts`.
- `npm run format` applies Prettier across the project and fixes import spacing.

## Coding Style & Naming Conventions

- Use ES module imports, two-space indentation, and rely on Prettier for layout consistency; never hand-format compiled output.
- Prefer PascalCase for components, camelCase for variables and functions, and kebab-case TypeScript filenames (e.g., `content-graph.ts`).
- Plugins should export a default `QuartzPlugin` and document configurable options with succinct JSDoc so they surface in the CLI help.

## Testing Guidelines

- Name new specs `*.test.ts` and place them beside the code they cover so TSX auto-discovers them.
- Mirror Quartz vocabulary inside `describe` labels (e.g., "content graph", "link resolver") and assert on public APIs rather than implementation details.
- Run `npm run check` before `npm test` when altering types to catch compiler errors early; include relevant golden content under `content/` when integration coverage is needed.

## Commit & Pull Request Guidelines

- Follow the existing conventional commit pattern `type(scope): summary` with optional issue references, such as `fix(search): correct rtl layout (#2100)`.
- Keep commits focused and ensure each passes `npm run check`; document any config migrations touching end-user options.
- Pull requests should capture: purpose, testing performed, and screenshots or GIFs for UI-affecting changes; link the relevant issue or discussion thread when closing it.
