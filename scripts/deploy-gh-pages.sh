#!/bin/bash
set -e

REPO_ROOT=$(git -C "$(dirname "$0")" rev-parse --show-toplevel)
DOCS_DIR="$REPO_ROOT/docs"
WORKTREE_DIR="/tmp/portfolio-gh-pages-deploy"

echo "▶ Deploying docs/ to gh-pages branch..."

# Clean up any leftover worktree from a previous failed run
git -C "$REPO_ROOT" worktree remove "$WORKTREE_DIR" --force 2>/dev/null || true
rm -rf "$WORKTREE_DIR"

# Fetch latest gh-pages so the worktree is up to date
git -C "$REPO_ROOT" fetch origin gh-pages 2>/dev/null || true

# Create a worktree pointing at gh-pages (creates the branch if it doesn't exist)
if git -C "$REPO_ROOT" ls-remote --exit-code origin gh-pages > /dev/null 2>&1; then
  git -C "$REPO_ROOT" worktree add "$WORKTREE_DIR" gh-pages
else
  git -C "$REPO_ROOT" worktree add --orphan -b gh-pages "$WORKTREE_DIR"
fi

# Sync docs/ → worktree (delete files removed from docs/, preserve .git)
rsync -a --delete --exclude='.git' "$DOCS_DIR/" "$WORKTREE_DIR/"

# Commit and push
cd "$WORKTREE_DIR"
git add -A
if git diff --staged --quiet; then
  echo "✓ gh-pages is already up to date, nothing to push."
else
  git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M')"
  git push origin gh-pages --force
  echo "✅ Deployed to gh-pages."
fi

# Clean up worktree
cd "$REPO_ROOT"
git worktree remove "$WORKTREE_DIR" --force
