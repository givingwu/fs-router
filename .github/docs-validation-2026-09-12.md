# Documentation and onboarding validation — 2026-09-12

This is the historical documentation-stage record. Subsequent dependency PRs broke the example installation; see the [follow-up dependency validation](./example-dependency-validation-2026-09-12.md) for the regression, restored versions and fresh checks. Results below do not certify later main commits.

Baseline: main `0971ed7` (library compatibility stage). Local environment: macOS arm64, Node 24.20.0, pnpm 10.34.5, Chromium 153.0.8010.12 (Playwright 1.63.0), axe-core 4.13.0. npm registry reported `@feoe/fs-router` latest as **0.0.13** during this review; 0.1.0 remains an unpublished candidate.

## Delivered behavior

- Flat Chinese docs retain `lang: zh` and `/fs-router/`. Explicit nav/sidebar are derived from the existing `_meta.json` files. Rspress 1's language-directory auto-navigation branch is not used, so no `docs/zh` move or URL prefix is required.
- dev/build/preview now load the same configuration. All 36 pre-existing HTML paths are retained in `tests/browser/legacy-doc-paths.json`; the English entry adds `english.html`. Existing `.html` and directory index outputs remain suitable for Pages. Revised section headings may change old deep-link fragments; current internal anchors are checked.
- README, guides, API and examples describe implemented APIs and tested versions. Removed unsupported Router 6/Node 16 claims, fictitious configuration APIs, automatic loader return types and unmeasured performance promises. English is a small maintained entry, not an incomplete site-wide locale switch.
- `examples/minimal-react` uses a local tarball and an independent npm lock. One app runs under Vite 6.4.3, Rspack 1.7.12 and Webpack 5.110.3. Build-before-typecheck ordering handles a clean checkout. Absolute public paths keep Rspack/Webpack deep-link refresh working.
- The pinned Rspress theme receives a small pnpm patch: Enter is ignored outside search or without a selected result; empty ArrowUp/Down avoids invalid selection indices. Browser regression checks also confirm valid keyboard result navigation. Reassess/remove the patch when upgrading the theme.
- Theme extension gives heading links accessible names, makes Prism code scroll areas focusable, and corrects light/dark text contrast. GitHub is a labelled nav link. Mobile menus, images and keyboard search are exercised.

## Executed checks

| Check | Result |
| --- | --- |
| `pnpm check`, `pnpm typecheck`, `git diff --check` | Passed |
| `pnpm test` | 47 tests passed |
| `pnpm check:consumers` | React 18/19 tarball consumers passed; four ESM/CJS/type entries, Vite/Rspack/Webpack builds and watch scenarios |
| `pnpm docs:build && pnpm docs:check` | 37 HTML pages; 1,739 local URL/asset/anchor references and 36 sitemap URLs; nav/sidebar and old path coverage passed |
| `pnpm docs:smoke` | 3 browser tests passed: dev/preview search and keyboard, navigation, mobile menus, images, no page exceptions |
| axe WCAG A/AA tags | No automated violations on home, quick start and English entry, in both light and dark (six scans) |
| `pnpm example:setup && pnpm example:check` | Real tarball installation; all three production builds and strict generated navigation type checks passed |
| `pnpm example:smoke` | 4 browser tests passed: typed navigation, fictional loader, visible fallback while lazy chunks are held, deep-link refresh, loader error, catch-all, Vite component update and route add/delete |
| Independent clean source snapshot | No node_modules or generated example routes copied; frozen root install, setup, all builds and 4 browser tests passed |
| `npm audit` in minimal example | 0 advisories, including development dependencies |
| Root `pnpm audit` | 2 existing moderate documentation-development advisories remain; no high/critical advisories |

The clean snapshot used the current tracked/new source files, without dependencies or generated outputs. Package-manager download caches were allowed; this is a clean dependency tree, not an offline or empty-cache test. A linked git worktree cannot install the existing simple-git-hooks setup into its `.git` file; validation commands were run explicitly.

## Reproduce from a clean checkout

```sh
npx --yes pnpm@10.34.5 install --frozen-lockfile
npx --yes pnpm@10.34.5 example:setup
npm --prefix examples/minimal-react run build:all
npx --yes pnpm@10.34.5 exec playwright install chromium
npx --yes pnpm@10.34.5 example:smoke
npx --yes pnpm@10.34.5 docs:build
npx --yes pnpm@10.34.5 docs:check
npx --yes pnpm@10.34.5 docs:smoke
```

For interactive use run `npm --prefix examples/minimal-react run dev`; stop with Ctrl-C. Browser tests own and close their local servers. Linux CI installs Chromium with `--with-deps`. Screenshots and the accessibility report are written to `.artifacts/browser` and uploaded by the read-only CI job for seven days.

## CI and review corrections

- Git hook installation is skipped quietly during packing and CI. npm 10.9.0 was reproduced running `prepare` despite `pack --ignore-scripts`; hook logs polluted the JSON consumed by package validation. A real npm 10.9.0 tarball now returns valid JSON and passes the React 18/19 consumer checks.
- Webpack/Rspack watch generation failures now become compilation errors, with emission vetoed until generation succeeds. The host compiler retains and resumes its own complete dependency graph; the plugin no longer manually restarts the host watcher with copied dependency collections. All nine watch-recovery scenarios additionally check that edits are not emitted during an error and appear after recovery.
- The search shortcut hint has explicit readable text color and no opacity transition during hydration. The browser accessibility test exercises the `Ctrl` text branch even on macOS, covering the Linux CI finding in addition to the native Mac search tests.
- The example's chunk fallback now belongs to the lazy `users/layout.tsx`, rather than the eagerly imported root layout. Each of the three browser scenarios holds JavaScript chunk requests until “Loading component…” is visible, then releases them and verifies the loaded page.
- Follow-up validation: all 47 unit tests passed on macOS arm64 and Linux arm64 with Node 24.20.0; React 18/19 packaged consumers passed on macOS; all three example builds and all seven browser tests passed. Linux unit tests used a fresh Linux dependency tree in a disposable container. Browser evidence remains Chromium/macOS locally; GitHub CI supplies the Ubuntu/Node 22/24 results.

## Discovery metadata

The Chinese homepage and English entry have descriptive titles and summaries, verified in the rendered HTML. The package description and keywords now name React Router, TypeScript and the three verified bundlers. Builds generate a sitemap with 36 non-404 public documentation URLs; CI checks every destination. No indexing, ranking or Star-count guarantee is made.

The repository About text currently reads “Implementation is a routing system based on Modern.js file-system routes style”, with no topics. Prepared About proposal: “File-based routing and typed navigation for existing React Router apps. Vite, Webpack and Rspack adapters.” Proposed topics: `react`, `react-router`, `typescript`, `file-based-routing`, `vite`, `webpack`, `rspack`, `typed-navigation`. These repository metadata edits and outreach belong to the community-stage review; this PR changes source metadata and docs.

## Sources and limits

- [Rspress 1 automatic navigation](https://v1.rspress.rs/guide/basic/auto-nav-sidebar), [i18n directories](https://v1.rspress.rs/guide/default-theme/i18n), [theme extension](https://v1.rspress.rs/guide/advanced/custom-theme), plus the installed 1.47.2 package source, were checked before choosing the flat-layout solution.
- [React Router 7.18.3 route objects](https://github.com/remix-run/react-router/blob/react-router%407.18.3/docs/start/data/route-object.md) and [pending UI](https://github.com/remix-run/react-router/blob/react-router%407.18.3/docs/start/data/pending-ui.md) distinguish client Data Router semantics from framework/server functionality.
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap) supports absolute, escaped URLs under the project path; the sitemap is a discovery hint and does not guarantee crawling or indexing.
- [Playwright web server lifecycle](https://playwright.dev/docs/test-webserver) informs test-owned service cleanup. [upload-artifact v7.0.1](https://github.com/actions/upload-artifact/releases/tag/v7.0.1) was resolved through the official repository to full SHA `043fb46d1a93c77aae656e7c1c64a875d1fc6a0a`.

Automated axe checks on representative pages do not constitute a full accessibility certification or screen-reader audit. Local browser evidence covers Chromium on macOS; Ubuntu browser CI and the existing Node 22/24 quality matrix remain configured. Firefox/WebKit, SSR/RSC and older feature-heavy examples are outside this validation. Browser chunk requests prove splitting behavior, not a performance advantage. External links are reviewed pointers, not a continuous network availability guarantee.

The public-content review found no employer/client names, private workspace URLs or real business data in the changed docs, example or screenshots. Existing third-party licenses remain. No npm publication or manual deployment occurs in this change. Merging to main uses the existing Pages workflow and permission boundary.
