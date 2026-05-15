# Claude Efficiency Setup — Design Spec
**Date:** 2026-05-15  
**Project:** Angular 20 Portfolio (woutdeleu/Portfolio)  
**Scope:** CLAUDE.md + 4 sub-agents + 4 project-local skills

---

## Overview

Set up Claude Code for maximum efficiency in this Angular 20 portfolio project. The three pillars:

1. **CLAUDE.md** — project context loaded into every Claude session automatically
2. **Sub-agents** (`.claude/agents/`) — domain-specialized agents for complex multi-step workflows
3. **Skills** (`.claude/skills/`) — invokable step-by-step guides for recurring tasks

---

## 1. CLAUDE.md

**Location:** `/CLAUDE.md` (project root)

### Contents

**Project overview**
- Angular 20 portfolio with dual view: portfolio view and terminal view
- Deployed to GitHub Pages from the `docs/` build output folder
- Content is gitignored and managed separately from source code

**Key commands**
```
npm start              # sync-content + ng serve
npm run sync-content   # rsync content/ → src/assets/data/ (run before serving)
npm run build          # sync-content + ng build (production to docs/)
ng generate component components/<name>
ng test
```

**Architecture**
- `src/app/components/` — UI components (portfolio, terminal-view, navigation-bar, contact-form, view-toggle, toggle-switch, cards/, download-cv-button/)
- `src/app/services/` — data.service.ts (content loading), email.service.ts (EmailJS)
- `src/app/models/` — TypeScript interfaces for all content types
- `src/app/directives/` — scroll-animation.directive.ts
- `src/app/utils/` — DateFunctions.ts

**Content pipeline**
```
content/<type>/*.json     ← source (gitignored, edit here)
content/<type>/index.json ← lists filenames in that directory
       ↓ npm run sync-content
src/assets/data/<type>/   ← served to the app (auto-generated, do not edit)
```
Each content type directory has an `index.json` listing the JSON filenames. DataService reads the index first, then fetches each file.

**Angular conventions**
- Module-based (not standalone) — `standalone: false` on all components
- Files: `kebab-case.component.ts/.html/.scss/.spec.ts`
- Classes: `PascalCase` + `Component` suffix
- Selectors: `app-kebab-case`
- Smart components interact with services; dumb components use `@Input`/`@Output` only
- Always implement `ngOnDestroy` with `Subject` + `takeUntil` for Observable cleanup

**Deployment**
```
npm run build                          # outputs to docs/
git add docs/ && git commit && git push  # GitHub Pages serves from docs/
```

**Agent reference**

| Say... | Agent used |
|---|---|
| "add a new content type" | content-manager |
| "generate a new component" | component-generator |
| "deploy the portfolio" | deploy |
| "why isn't X showing up" | debug |

**Skill reference**

| Invoke | What it does |
|---|---|
| `/add-content-type` | Guided walkthrough: schema → JSON files → index → service → component |
| `/new-component` | Guided scaffold: ng generate → module wiring → smart/dumb pattern |
| `/deploy` | Full deploy sequence: sync → build prod → push |
| `/dev-start` | Pre-flight checks + sync + ng serve |

---

## 2. Sub-agents

**Location:** `.claude/agents/<name>.md`

### 2a. content-manager

**Role:** Expert in the portfolio's content pipeline. Adds, edits, or removes content types and entries.

**Workflow knowledge:**
1. Content lives in `content/<type>/` as individual JSON files
2. Each directory has `index.json` listing filenames (without extension)
3. Sync via `npm run sync-content` copies to `src/assets/data/`
4. DataService loads content by reading index then fetching each file
5. TypeScript model goes in `src/app/models/`
6. New content types need a `getXxx()` method added to `data.service.ts`

**Capabilities:** Read/write JSON files, run `npm run sync-content`, generate model interfaces

### 2b. component-generator

**Role:** Scaffolds Angular components following project conventions.

**Workflow knowledge:**
1. Run `ng generate component components/<name>` (or subdir)
2. Add to `app.module.ts` declarations if not auto-added
3. Determine smart vs dumb: if it needs data, inject DataService; if display-only, use @Input
4. Implement `ngOnDestroy` with Subject pattern for any Observable subscriptions
5. Style in `.scss` using project color variables from `src/assets/styles/colors.scss`

**Capabilities:** Run ng generate, read/write TS/HTML/SCSS files, update module

### 2c. deploy

**Role:** Handles the full deployment pipeline to GitHub Pages.

**Workflow:**
1. Run `npm run sync-content` — sync latest content
2. Run `npm run build` — production build output to `docs/`
3. Stage docs/: `git add docs/`
4. Commit with message describing what changed
5. Push to main: `git push origin main`
6. Confirm GitHub Actions / Pages picks it up

**Capabilities:** Run npm scripts, git add/commit/push

### 2d. debug

**Role:** Diagnoses issues — content not loading, Angular errors, broken data flow.

**Diagnostic approach:**
1. Content not showing → check index.json lists the file, run sync-content, verify `src/assets/data/` has the file
2. Angular compilation error → read the error, find the file/line, check module declarations and imports
3. Service not returning data → check DataService method, verify HTTP path matches assets/data/ structure
4. Component not rendering → check module declarations, selector spelling, template syntax

**Capabilities:** Read files, run build/test, grep for errors

---

## 3. Skills

**Location:** `.claude/skills/<name>.md`

### 3a. add-content-type (`/add-content-type`)

Step-by-step walkthrough:
1. Ask: what is the content type name? (e.g., "testimonials")
2. Ask: what fields does each item have?
3. Generate TypeScript interface in `src/app/models/`
4. Create `content/<type>/` directory and `index.json`
5. Create at least one example JSON file
6. Add `getXxx()` method to `data.service.ts`
7. Run `npm run sync-content`
8. Prompt: "Now wire it into a component — use `/new-component` or tell me where to display this data."

### 3b. new-component (`/new-component`)

Step-by-step walkthrough:
1. Ask: component name and location (under `components/`)?
2. Ask: smart (needs data from service) or dumb (display-only)?
3. Run `ng generate component components/<name>`
4. If smart: inject DataService, add Observable + takeUntil pattern
5. If dumb: define @Input properties
6. Verify added to `app.module.ts` declarations
7. Prompt: "Component scaffolded. Where should it appear in the template?"

### 3c. deploy (`/deploy`)

1. Check for uncommitted content changes — remind to commit them or they'll be lost after sync
2. Run `npm run sync-content`
3. Run `npm run build`
4. Check build succeeded (look for errors)
5. `git add docs/`
6. `git commit -m "Deploy: <brief description>"`
7. `git push origin main`
8. Report: "Deployed. GitHub Pages will update in ~1 minute."

### 3d. dev-start (`/dev-start`)

1. Check Node version (`node -v`) — warn if < 18
2. Check `node_modules/` exists — suggest `npm install` if missing
3. Run `npm run sync-content`
4. Run `ng serve` (or `npm start` which includes sync)
5. Report: "Dev server running at http://localhost:4200"

---

## File layout after implementation

```
/
├── CLAUDE.md
├── .claude/
│   ├── settings.local.json      (existing, unchanged)
│   ├── agents/
│   │   ├── content-manager.md
│   │   ├── component-generator.md
│   │   ├── deploy.md
│   │   └── debug.md
│   └── skills/
│       ├── add-content-type.md
│       ├── new-component.md
│       ├── deploy.md
│       └── dev-start.md
```

---

## Out of scope

- CI/CD changes
- Test automation hooks
- Email service configuration
- Any visual/UI changes to the portfolio itself
