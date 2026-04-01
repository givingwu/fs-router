---
name: fs-router-helper
description: Helper for @feoe/fs-router - project initialization, adding pages/routes, debugging, and API documentation
---

Assist users of the @feoe/fs-router library with common tasks:

## When to use this skill

Use this skill when the user asks for help with:
- Project initialization with fs-router
- Adding new pages or routes
- Debugging routing issues
- fs-router API documentation and usage

## How it works

This skill detects the user's intent by:
1. Analyzing keywords in the user's request
2. Checking the project state (config files, routes directory)
3. Guiding the user through the appropriate workflow

## Project State Detection

Before helping the user, check the following:

1. **Check for routes directory**
   - Run: `ls -la src/routes 2>/dev/null || echo "NOT_FOUND"`
   - Sets: `HAS_ROUTES_DIR` variable

2. **Check for build configuration**
   - Run: `ls -la vite.config.ts rspack.config.js webpack.config.js 2>/dev/null | head -1`
   - Sets: `BUILD_TOOL` variable (vite | rspack | webpack | none)

3. **Check for fs-router in dependencies**
   - Run: `grep -o "@feoe/fs-router" package.json || echo "NOT_FOUND"`
   - Sets: `HAS_FS_ROUTER` variable

4. **Check generated routes file**
   - Run: `ls -la src/routes.tsx src/routes.ts 2>/dev/null || echo "NOT_FOUND"`
   - Sets: `HAS_GENERATED_ROUTES` variable
