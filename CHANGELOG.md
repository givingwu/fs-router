# Changelog

## 0.1.0 — Unreleased

### Breaking changes

- Support baseline: Node >=22.12.0, React/React DOM ^18.3.1 or ^19.2.8, React Router DOM ^7.18.3. Router 6 is no longer supported. Consumers own React, Router and Loadable peer dependencies.
- Generate imports without an implicit `@` alias. Explicit alias configuration remains available.
- Generate navigation declarations by default. Outputs must be distinct files outside all route directories; symbolic-link outputs and duplicate route conventions are rejected.
- Dynamic/group paths now agree between runtime extraction and declarations. Conflicting terminal routes fail the build instead of relying on scan order.

### Fixed

- ESM and CJS have their own bundled declaration entry points; public plugin declarations reference the corresponding bundler rather than all unplugin adapters.
- Required navigation parameters are checked correctly with Router 7.
- Named data actions and associated files are detected independently of directory enumeration order; layout loaders survive route flattening.
- Escape file names in generated code, skip symlinks/hidden directories, retain errors and serialize generation requests.
- Use host-owned watching; support new/deleted routes and avoid rewriting unchanged output.

### Validation and release

- Tarball consumer fixtures cover React 18/19, Vite/Webpack/Rspack, strict TypeScript and route execution.
- Add manual package preview and gated npm OIDC workflow, migration/support notes and rollback instructions. No npm version has been published by this change.

## 0.0.13

Existing release before this changelog. Historical behavior can be reviewed in Git history; release details are not reconstructed here.
