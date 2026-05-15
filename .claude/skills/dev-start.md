---
name: dev-start
description: Pre-flight checks and dev server startup — verifies Node version, node_modules, syncs content, and starts ng serve.
---

# Dev Start

Start the development environment with pre-flight checks.

## Step 1: Check Node version

```bash
node -v
```

If version is below 18.x, warn: "Node 18+ is required. Current version may cause issues."

## Step 2: Check dependencies installed

```bash
ls node_modules | head -1
```

If `node_modules/` is missing or empty:
```bash
npm install
```

## Step 3: Sync content

```bash
npm run sync-content
```

This copies `content/` → `src/assets/data/`. Always do this before serving so content is up to date.

## Step 4: Start dev server

```bash
ng serve
```

Or equivalently (also syncs content again):
```bash
npm start
```

## Step 5: Confirm

Say: "Dev server running at http://localhost:4200. The app will hot-reload on file changes. Note: changes to `content/` files require running `npm run sync-content` separately — they do not trigger hot reload."
