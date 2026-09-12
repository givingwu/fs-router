# Community readiness validation — 2026-09-12

Based on merged main `ced7ac9` (the completed documentation stage). This change adds repository community files and documentation; it does not change library runtime, dependencies, workflow permissions, repository settings or published package versions.

## Delivered paths

| Need | Review location |
| --- | --- |
| Bilingual bug/feature intake, accessible fallback | `ISSUE_TEMPLATE/bug.yml`, `feature.yml`, `config.yml`; blank issues remain enabled, no invented labels/assignees/projects |
| Reviewable contributions | `pull_request_template.md`, [CONTRIBUTING](../CONTRIBUTING.md), [development](../docs/contributing/development.md) |
| Conduct and maintenance | [Code of Conduct](../CODE_OF_CONDUCT.md), [governance](../GOVERNANCE.md), [support](../SUPPORT.md); vulnerability instructions continue to come from unchanged [SECURITY](../SECURITY.md) |
| Actual small tasks and priorities | [C1/C2](../docs/contributing/first-contribution.md), [roadmap](../ROADMAP.md); tasks are documented and unclaimed, not fabricated external issues or completed contributions |
| Positioning and reusable material | [Selection](../docs/guide/choosing.md), [demo/release/community drafts](../docs/contributing/communication.md) |
| Adoption evidence and decisions | [Plan](../docs/contributing/adoption.md), [dated public API snapshot](./community-baseline-2026-09-12.json) |

README and the English guide link to contribution/support entry points. Four new pages are included in navigation and the generated sitemap. Existing documentation paths and `/fs-router/` remain covered by the existing checks.

## Local verification

Environment: macOS arm64, Node 24.20.0, pnpm 10.34.5, Chromium via Playwright 1.63.0. Commands use `npx --yes pnpm@10.34.5` in this environment because pnpm is not globally installed.

| Check | Result |
| --- | --- |
| Frozen root install | Passed from this checkout's fresh dependency tree using the package cache. Worktree hook installation logged the existing `.git/hooks` ENOTDIR; quality checks were run explicitly |
| `pnpm check`, `pnpm typecheck` | Passed; Biome checked 54 scoped files. Markdown/YAML are separately reviewed |
| `pnpm test` | 47 tests passed in 7 files |
| `pnpm example:setup` | Built and packed the candidate; all 4 ESM/CJS/type entries passed; installed the real tarball in the independent minimal example |
| `pnpm example:check` | Vite, Rspack and Webpack production builds plus strict TypeScript passed |
| `pnpm example:smoke` | 4 passed: 3 production browser scenarios and Vite component/route-edit behavior |
| `pnpm docs:build`, `pnpm docs:check` | 41 HTML pages, 1,987 local references/anchors, 40 sitemap URLs; source/legacy paths and both language entry summaries passed |
| `pnpm docs:smoke` | 3 passed: dev/preview navigation and search, mobile menus, images, representative light/dark accessibility scans |
| New-page browser inspection | All four pages loaded individually without page errors; headings/navigation checked, desktop and mobile document width checked, selection and adoption screenshots visually reviewed |
| Forms | All 3 YAML files parsed using the installed YAML parser; checked required top-level properties, supported input types, unique IDs/labels, required flags and HTTPS contact links against GitHub's documented syntax |
| Markdown and snapshot | Relative file destinations checked; snapshot JSON parsed; `git diff --check` passed |
| Root audit | 2 existing moderate advisories, no high/critical; unchanged dependencies. Historical independent examples are not covered by this result |

The two existing Playwright configurations share `test-results`. Running them concurrently initially caused a trace-file ENOENT; rerunning docs after the example suite completed passed. Development instructions now require sequential execution. No assertion was disabled and no runtime fix was needed. New-page inspection uses individual browser pages to observe settled hydration.

No full React 18/19 consumer matrix was rerun for these prose/template changes; the existing package and example checks above were rerun, and the previous matrix evidence remains in [library validation](./library-validation-2026-09-12.md). GitHub CI runs its configured full matrix on the PR. Do not infer CI completion from local results.

Local parser/field checks do not execute GitHub's hosted form renderer. Forms and community-file detection take effect on the default branch after merge; verify the Issue chooser then without submitting a dummy public issue. GitHub community health may recognize a custom conduct document without matching a standardized code identifier; this report claims neither a new percentage nor a badge.

## Evidence, sources and choices

Checked 2026-09-12:

- [GitHub Issue forms](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms), [form field schema](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-githubs-form-schema), [chooser configuration](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository) and [PR template placement](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository): use the documented locations and plain required text fields; retain blank intake for questions and incomplete trial reports.
- [GitHub conduct guidance](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-code-of-conduct-to-your-project) and [abuse reporting](https://docs.github.com/en/communities/maintaining-your-safety-on-github/reporting-abuse-or-spam): custom conduct policy with owner accountability and proportionate handling. `gh api users/givingwu` confirmed the owner publicly lists `givingwu@gmail.com`; no email was sent, delivery/monitoring was not tested, and no private security mailbox or moderation team is invented. The owner should confirm this conduct contact in review. GitHub handles its own reports, not project appeals.
- [OpenSSF Best Practices entry criteria](https://www.bestpractices.dev/en/criteria/0): apply relevant feedback, contribution, English participation and release-note practices. This is a scoped readiness improvement, not a full criteria audit or certification. No badge application, score claim or external endorsement was created; private vulnerability reporting and release administration still require owner decisions.
- [React Router modes](https://reactrouter.com/start/modes), [TanStack file routing](https://tanstack.com/router/latest/docs/routing/file-based-routing) and [Next.js layouts/pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages): compare architecture choices with explicit fs-router limits, not speed, popularity or blanket superiority. Current upstream docs do not extend this package's tested version matrix.
- [npm download counts](https://github.com/npm/registry/blob/main/docs/download-counts.md), [GitHub repository traffic](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-traffic-to-a-repository), and the snapshot's exact API URLs: record equal complete UTC windows and denominators. Downloads are 23 versus 44; external adoption is unknown. Zero public trial reports and zero merged non-owner/non-bot PR authors are observations, not proof that nobody uses the package.

## Remaining owner decisions

Review the conduct contact and maintenance policy; approve or revise the exact About/topics proposal; choose maintenance capacity and a Day 0. npm 0.1.0 publication, trusted-publisher/security settings, and the wording/channel/timing of any outreach require their concrete approvals. The drafts are complete enough to review but no settings, posts, messages, releases or paid actions were performed.

Public-content review covered the changed files, generated documentation/library text and screenshots: use project/upstream public information and fictional demo data; no employer/client branding, private workspace links or real business data was added. Necessary technical-source links and third-party licenses remain. This review is scoped to this change and its generated outputs, not a guarantee about every historical repository file.
