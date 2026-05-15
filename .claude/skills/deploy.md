---
name: deploy
description: Full deployment sequence for the portfolio — syncs content, builds production bundle, commits docs/, and pushes to main for GitHub Pages.
---

# Deploy

Execute the full deployment pipeline step by step.

## Step 1: Check for uncommitted source changes

```bash
git status
```

If there are uncommitted changes in `src/`, `content/`, or other source files:
- Ask: "You have uncommitted changes. Do you want to commit them before deploying, or deploy only what's already committed?"
- If commit first: help them commit, then continue

## Step 2: Sync content

```bash
npm run sync-content
```

This rsyncs `content/` → `src/assets/data/`. Required before every build since content is gitignored.

## Step 3: Build for production

```bash
npm run build
```

Wait for completion. If it fails:
- Show the error
- Stop — do NOT proceed with a failed build
- Suggest using the `debug` agent to diagnose

## Step 4: Stage build output

```bash
git add docs/
git status
```

Verify that only `docs/` files are staged.

## Step 5: Commit

Ask: "What changed in this deploy? I'll use it as the commit message."

```bash
git commit -m "Deploy: <user's description>"
```

## Step 6: Push

```bash
git push origin main
```

## Step 7: Confirm

Say: "Deployed. GitHub Pages will update in ~1 minute."
