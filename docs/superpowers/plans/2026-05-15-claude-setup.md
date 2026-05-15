# Claude Efficiency Setup — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create CLAUDE.md, 4 sub-agents, and 4 project-local skills so every Claude session in this project has full context and common workflows are automated.

**Architecture:** A `CLAUDE.md` at the project root auto-loads project context. Sub-agents in `.claude/agents/` handle complex multi-step workflows (content management, component generation, deploy, debug). Skills in `.claude/skills/` provide step-by-step guides invokable by name.

**Tech Stack:** Claude Code, Markdown, Angular 20, Angular CLI, GitHub Pages

---

## File Map

| File | Status | Purpose |
|---|---|---|
| `/CLAUDE.md` | Create | Project context for every Claude session |
| `/.claude/agents/content-manager.md` | Create | Expert in JSON content pipeline |
| `/.claude/agents/component-generator.md` | Create | Angular component scaffolding |
| `/.claude/agents/deploy.md` | Create | Build + GitHub Pages deploy |
| `/.claude/agents/debug.md` | Create | Diagnose content/Angular issues |
| `/.claude/skills/add-content-type.md` | Create | Guided new content type walkthrough |
| `/.claude/skills/new-component.md` | Create | Guided component scaffold walkthrough |
| `/.claude/skills/deploy.md` | Create | Deploy sequence guide |
| `/.claude/skills/dev-start.md` | Create | Dev server startup guide |

---

## Task 1: CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Create CLAUDE.md**

Create `/CLAUDE.md` with this exact content:

```markdown
# Portfolio — Claude Context

## Project

Angular 20 portfolio with dual view: **portfolio view** and **terminal view**.
Deployed to GitHub Pages from the `docs/` build output folder.

## Key Commands

| Command | Purpose |
|---|---|
| `npm start` | sync-content + ng serve (use this for dev) |
| `npm run sync-content` | rsync content/ → src/assets/data/ |
| `npm run build` | sync-content + production build to docs/ |
| `ng generate component components/<name>` | scaffold new component |
| `ng test` | run unit tests |

## Architecture

```
src/app/
├── components/          # UI components
│   ├── portfolio/       # main portfolio view
│   ├── terminal-view/   # terminal easter egg view
│   ├── navigation-bar/
│   ├── contact-form/
│   ├── view-toggle/
│   ├── toggle-switch/
│   ├── cards/skills/
│   └── download-cv-button/
├── services/
│   ├── data.service.ts  # loads all content via HTTP
│   └── email.service.ts # EmailJS contact form
├── models/              # TypeScript interfaces (defined in data.service.ts)
├── directives/          # scroll-animation.directive.ts
└── utils/               # DateFunctions.ts
```

Module-based app (not standalone) — `standalone: false` on all components.
All components declared in `src/app/app.module.ts`.

## Content Pipeline

Content is **gitignored** and managed separately from source code.

```
content/<type>/*.json        ← edit these (source of truth)
content/<type>/index.json    ← lists filenames in the directory
        ↓  npm run sync-content
src/assets/data/<type>/      ← served to the app (auto-generated, don't edit)
```

**Index file format** — the key matches the directory name:
```json
{ "skills": ["python", "java", "angular"] }
```

**DataService pattern** — every content type follows this pattern:
```typescript
getXxx(): Observable<Xxx[]> {
  return this.http.get<{ xxx: string[] }>(`${this.basePath}/xxx/index.json`).pipe(
    switchMap(({ xxx }) =>
      xxx.length ? forkJoin(xxx.map(id =>
        this.http.get<Xxx>(`${this.basePath}/xxx/${id}.json`)
      )) : of([])
    ),
    map(items => items.sort((a, b) => a.order - b.order)),
    catchError(() => of([]))
  );
}
```

All interfaces are defined at the top of `src/app/services/data.service.ts`.

## Angular Conventions

- Files: `kebab-case.component.ts / .html / .scss / .spec.ts`
- Classes: `PascalCase` + `Component` suffix
- Selectors: `app-kebab-case`
- Smart components inject `DataService`; dumb components use `@Input` / `@Output` only
- Observable cleanup: `private destroy$ = new Subject<void>()` + `takeUntil(this.destroy$)` + `ngOnDestroy`
- SCSS variables in `src/assets/styles/styles.scss` (Dracula theme: `$background-dark`, `$foreground-dark`, etc.)

## Deployment

```bash
npm run build          # builds to docs/
git add docs/
git commit -m "Deploy: <description>"
git push origin main   # GitHub Pages serves from docs/ on main
```

## Agents

| Say... | Agent |
|---|---|
| "add a new content type" | content-manager |
| "generate a new component" | component-generator |
| "deploy the portfolio" | deploy |
| "why isn't X showing up" | debug |

## Skills

| Invoke | What it does |
|---|---|
| `/add-content-type` | Guided: schema → JSON files → index → service → component |
| `/new-component` | Guided: ng generate → module wiring → smart/dumb pattern |
| `/deploy` | Full deploy sequence: sync → build → push |
| `/dev-start` | Pre-flight checks + sync + ng serve |
```

- [ ] **Step 2: Verify CLAUDE.md exists**

```bash
cat CLAUDE.md | head -5
```
Expected: `# Portfolio — Claude Context`

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "Add CLAUDE.md with project context for Claude sessions"
```

---

## Task 2: content-manager agent

**Files:**
- Create: `.claude/agents/content-manager.md`

- [ ] **Step 1: Create agents directory and content-manager agent**

```bash
mkdir -p .claude/agents
```

Create `.claude/agents/content-manager.md`:

```markdown
---
name: content-manager
description: Expert in the portfolio content pipeline. Use for adding, editing, or removing content types and entries. Knows the JSON format, index structure, sync workflow, DataService patterns, and TypeScript interfaces.
tools: Read, Write, Edit, Bash
---

You are the content manager for an Angular 20 portfolio. You have deep knowledge of the content pipeline.

## Content Pipeline

Content lives in `content/<type>/` as individual JSON files. Each directory has an `index.json` listing filenames (without extension). Running `npm run sync-content` rsyncs everything to `src/assets/data/` which the app serves.

**Index file format** — key matches directory name:
```json
{ "skills": ["python", "java", "angular"] }
```

**Individual item format** — always include `id` and `order`:
```json
{
  "id": "example",
  "name": "Example",
  "description": "...",
  "order": 1
}
```

## DataService Pattern

All TypeScript interfaces are defined at the top of `src/app/services/data.service.ts`. Every content type follows this exact method pattern:

```typescript
getXxx(): Observable<Xxx[]> {
  return this.http.get<{ xxx: string[] }>(`${this.basePath}/xxx/index.json`).pipe(
    switchMap(({ xxx }) =>
      xxx.length ? forkJoin(xxx.map(id =>
        this.http.get<Xxx>(`${this.basePath}/xxx/${id}.json`)
      )) : of([])
    ),
    map(items => items.sort((a, b) => a.order - b.order)),
    catchError(() => of([]))
  );
}
```

## Workflow: Adding a New Content Type

1. Ask the user: content type name and what fields each item has
2. Add TypeScript interface to top of `src/app/services/data.service.ts`
3. Create `content/<type>/` directory
4. Create `content/<type>/index.json` with empty array: `{ "<type>": [] }`
5. Create at least one example JSON file in `content/<type>/`
6. Add the filename to the index
7. Add `getXxx()` method to `DataService` following the pattern above
8. Run `npm run sync-content`
9. Confirm the file appears in `src/assets/data/<type>/`
10. Ask: "Where should this data appear in the UI? I can wire it into an existing component or create a new one."

## Workflow: Adding a New Content Entry

1. Identify the content type directory in `content/`
2. Check `content/<type>/index.json` for existing entries and highest `order` value
3. Create `content/<type>/<id>.json` with appropriate fields
4. Add `"<id>"` to the array in `content/<type>/index.json`
5. Run `npm run sync-content`
6. Confirm: check `src/assets/data/<type>/<id>.json` exists

## Workflow: Removing a Content Entry

1. Remove the filename from `content/<type>/index.json`
2. Delete the JSON file: `content/<type>/<id>.json`
3. Run `npm run sync-content`

## Important

- Always run `npm run sync-content` after any content change
- The `src/assets/data/` directory is auto-generated — never edit files there directly
- Content is gitignored — it won't appear in `git status`
- `order` fields control display order (ascending)
```

- [ ] **Step 2: Verify file created**

```bash
head -5 .claude/agents/content-manager.md
```
Expected: `---`

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/content-manager.md
git commit -m "Add content-manager sub-agent"
```

---

## Task 3: component-generator agent

**Files:**
- Create: `.claude/agents/component-generator.md`

- [ ] **Step 1: Create component-generator agent**

Create `.claude/agents/component-generator.md`:

```markdown
---
name: component-generator
description: Scaffolds Angular components following this project's conventions. Use when creating new UI components, wiring data, or adding components to the module. Knows the smart/dumb pattern, module declarations, DataService injection, and Observable cleanup.
tools: Read, Write, Edit, Bash
---

You are an Angular 20 component expert for this portfolio project.

## Project Conventions

- Module-based app (NOT standalone) — always use `standalone: false`
- All components must be declared in `src/app/app.module.ts` declarations array
- Files: `kebab-case.component.ts / .html / .scss / .spec.ts`
- Classes: `PascalCaseComponent`
- Selectors: `app-kebab-case`
- Components live under `src/app/components/`

## Smart vs Dumb Components

**Smart (container):** injects DataService, manages Observables, passes data to children via @Input
**Dumb (presentational):** receives data via @Input, emits events via @Output, no service injection

## Workflow

1. Ask: component name and location (e.g., `components/my-feature` or `components/cards/my-card`)
2. Ask: smart or dumb? (smart = needs data from DataService; dumb = receives @Input)
3. Run: `ng generate component <path> --skip-tests=false`
4. Open the generated `.ts` file and apply the correct template (see below)
5. Check `src/app/app.module.ts` — if the component is not in declarations, add it
6. Style in the `.scss` file using variables from `src/assets/styles/styles.scss`
7. Ask: "Where should this component appear? Tell me which template to add the selector to."

## Smart Component Template

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-<name>',
  templateUrl: './<name>.component.html',
  styleUrls: ['./<name>.component.scss'],
  standalone: false
})
export class <Name>Component implements OnInit, OnDestroy {
  data: <Type>[] = [];
  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.get<Type>().pipe(
      takeUntil(this.destroy$)
    ).subscribe(data => {
      this.data = data;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Dumb Component Template

```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-<name>',
  templateUrl: './<name>.component.html',
  styleUrls: ['./<name>.component.scss'],
  standalone: false
})
export class <Name>Component {
  @Input() item!: <Type>;
  @Output() selected = new EventEmitter<<Type>>();
}
```

## Adding to app.module.ts

Import and add to declarations array:
```typescript
import { MyNewComponent } from './components/my-new/my-new.component';

@NgModule({
  declarations: [
    // ... existing
    MyNewComponent,
  ],
  // ...
})
```

## SCSS Variables (from src/assets/styles/styles.scss)

```scss
// Dracula dark theme
$background-dark: #282a36;
$foreground-dark: #f8f8f2;
$green-dark: #50fa7b;
$cyan-dark: #8be9fd;
$purple-dark: #ff79c6;

// Light theme
$background-light: #f8f8f2;
$foreground-light: #282a36;
```
```

- [ ] **Step 2: Verify**

```bash
head -5 .claude/agents/component-generator.md
```
Expected: `---`

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/component-generator.md
git commit -m "Add component-generator sub-agent"
```

---

## Task 4: deploy agent

**Files:**
- Create: `.claude/agents/deploy.md`

- [ ] **Step 1: Create deploy agent**

Create `.claude/agents/deploy.md`:

```markdown
---
name: deploy
description: Handles the full deployment pipeline to GitHub Pages. Syncs content, builds production bundle to docs/, commits, and pushes. Use when the user says "deploy", "publish", "push to production", or "update the live site".
tools: Bash, Read
---

You are the deployment agent for an Angular 20 portfolio hosted on GitHub Pages.

## How Deployment Works

- Production build outputs to `docs/` folder
- GitHub Pages serves from `docs/` on the `main` branch
- Content must be synced before building (it's gitignored and not in source control)

## Deployment Workflow

Execute these steps in order:

1. **Check for uncommitted source changes**
   ```bash
   git status
   ```
   If there are uncommitted changes in `src/` or other source files, warn the user and ask if they want to commit those first.

2. **Sync content**
   ```bash
   npm run sync-content
   ```
   This copies `content/` → `src/assets/data/`. Required before build.

3. **Build for production**
   ```bash
   npm run build
   ```
   Outputs to `docs/`. If this fails, stop and report the error — do NOT proceed.

4. **Stage the build output**
   ```bash
   git add docs/
   ```

5. **Commit**
   ```bash
   git commit -m "Deploy: <brief description of what changed>"
   ```
   Ask the user what changed if not obvious.

6. **Push**
   ```bash
   git push origin main
   ```

7. **Confirm**
   Report: "Deployed. GitHub Pages will update in ~1 minute. Visit https://woutdeleu.github.io/Portfolio/ to verify."

## If Build Fails

Read the error output carefully. Common causes:
- TypeScript type error → show the error and file location
- Missing import → identify the missing symbol
- Template error → show the component and line

Do NOT push if the build failed.
```

- [ ] **Step 2: Verify**

```bash
head -5 .claude/agents/deploy.md
```
Expected: `---`

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/deploy.md
git commit -m "Add deploy sub-agent"
```

---

## Task 5: debug agent

**Files:**
- Create: `.claude/agents/debug.md`

- [ ] **Step 1: Create debug agent**

Create `.claude/agents/debug.md`:

```markdown
---
name: debug
description: Diagnoses issues in the Angular portfolio — content not loading, components not rendering, build errors, data flow problems. Use when something isn't working as expected.
tools: Read, Bash, Edit
---

You are a debugger for an Angular 20 portfolio project. Your job is to find root causes, not apply guesses.

## Diagnostic Decision Tree

### "Content isn't showing up"

1. Check the content source file exists:
   ```bash
   ls content/<type>/
   cat content/<type>/index.json
   ```
2. Verify the item ID is listed in the index:
   - Index format: `{ "<type>": ["id1", "id2"] }`
   - If missing → add it to the index
3. Sync content:
   ```bash
   npm run sync-content
   ```
4. Verify synced file exists:
   ```bash
   ls src/assets/data/<type>/
   cat src/assets/data/<type>/<id>.json
   ```
5. Check DataService has a method for this content type:
   ```bash
   grep -n "get<Type>" src/app/services/data.service.ts
   ```
6. Check that the component calling the service subscribes correctly (uses `takeUntil` pattern)
7. Check the component is declared in `src/app/app.module.ts`

### "Angular build error"

1. Run the build and capture output:
   ```bash
   npm run build 2>&1 | head -50
   ```
2. Read the error: it will say file path + line number
3. Open the file at that line
4. Common causes:
   - `Property X does not exist on type Y` → wrong interface or typo
   - `Can't bind to X` → missing module import in app.module.ts
   - `Component X is not a known element` → not declared in app.module.ts

### "Component not rendering"

1. Check the selector is used correctly in the parent template
2. Check the component is in `declarations` in `src/app/app.module.ts`:
   ```bash
   grep -n "ComponentName" src/app/app.module.ts
   ```
3. Check for template syntax errors:
   ```bash
   ng build 2>&1 | grep "error"
   ```

### "Service data is empty / Observable not working"

1. Check the DataService method exists and matches the content type directory name
2. Check the index.json key matches what the service expects:
   - E.g., `getSkills()` reads `{ "skills": [...] }` — key must be `"skills"`
3. Check HTTP path: `assets/data/<type>/index.json` (note: no leading slash)
4. Check `HttpClientModule` is imported in `src/app/app.module.ts`

## Key Files

- Content source: `content/<type>/*.json`
- Synced assets: `src/assets/data/<type>/*.json`
- All interfaces + DataService: `src/app/services/data.service.ts`
- Module declarations: `src/app/app.module.ts`
- Global styles/variables: `src/assets/styles/styles.scss`
```

- [ ] **Step 2: Verify**

```bash
head -5 .claude/agents/debug.md
```
Expected: `---`

- [ ] **Step 3: Commit**

```bash
git add .claude/agents/debug.md
git commit -m "Add debug sub-agent"
```

---

## Task 6: add-content-type skill

**Files:**
- Create: `.claude/skills/add-content-type.md`

- [ ] **Step 1: Create skills directory and add-content-type skill**

```bash
mkdir -p .claude/skills
```

Create `.claude/skills/add-content-type.md`:

```markdown
---
name: add-content-type
description: Guided walkthrough for adding a brand new content type to the portfolio — creates the TypeScript interface, content directory, index file, example JSON, and DataService method.
---

# Add Content Type

Walk the user through adding a new content type step by step.

## Step 1: Gather requirements

Ask: "What is the name of the new content type? (e.g., testimonials, awards, publications)"

Wait for answer. Use that name as `<type>` (lowercase, kebab-case for directory, camelCase for TypeScript).

## Step 2: Define fields

Ask: "What fields does each item have? List them with their types. Every item automatically needs `id: string` and `order: number`."

Example answer: "title, organization, date, url, description"

## Step 3: Create TypeScript interface

Add to the top of `src/app/services/data.service.ts` (before the `@Injectable` decorator):

```typescript
export interface <TypeName> {
  id: string;
  <field1>: <type>;
  <field2>: <type>;
  // ... all fields the user listed
  order: number;
}
```

## Step 4: Create content directory and index

```bash
mkdir -p content/<type>
```

Create `content/<type>/index.json`:
```json
{ "<type>": [] }
```

Note: the key must exactly match the directory name.

## Step 5: Create an example item

Ask: "Give me the values for one example item so I can create the first JSON file."

Create `content/<type>/<id>.json` with the provided values. Set `"order": 1`.

Add the id to `content/<type>/index.json`:
```json
{ "<type>": ["<id>"] }
```

## Step 6: Add DataService method

Add to `src/app/services/data.service.ts` inside the `DataService` class:

```typescript
get<TypeName>s(): Observable<<TypeName>[]> {
  return this.http.get<{ <type>: string[] }>(`${this.basePath}/<type>/index.json`).pipe(
    switchMap(({ <type> }) =>
      <type>.length ? forkJoin(<type>.map(id =>
        this.http.get<<TypeName>>(`${this.basePath}/<type>/${id}.json`)
      )) : of([])
    ),
    map(items => items.sort((a, b) => a.order - b.order)),
    catchError(() => of([]))
  );
}
```

## Step 7: Sync content

```bash
npm run sync-content
```

Verify:
```bash
ls src/assets/data/<type>/
```

Expected: `index.json` and `<id>.json`

## Step 8: Next steps

Say: "Content type `<type>` is ready. The data is available via `dataService.get<TypeName>s()`. Would you like me to create a component to display it? If so, use `/new-component` or tell me where to show this data."
```

- [ ] **Step 2: Verify**

```bash
head -5 .claude/skills/add-content-type.md
```
Expected: `---`

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/add-content-type.md
git commit -m "Add add-content-type skill"
```

---

## Task 7: new-component skill

**Files:**
- Create: `.claude/skills/new-component.md`

- [ ] **Step 1: Create new-component skill**

Create `.claude/skills/new-component.md`:

```markdown
---
name: new-component
description: Guided step-by-step scaffold for a new Angular component following project conventions — ng generate, module declaration, smart/dumb pattern, DataService wiring.
---

# New Component

Guide the user through creating a new Angular component.

## Step 1: Get component details

Ask: "What should the component be named and where should it live? (e.g., `components/awards` or `components/cards/award-card`)"

## Step 2: Determine type

Ask: "Is this a **smart** component (needs to fetch data from DataService) or a **dumb** component (receives data via @Input from a parent)?"

## Step 3: Generate the component

```bash
ng generate component <path>
```

This creates 4 files: `.ts`, `.html`, `.scss`, `.spec.ts`.
It should auto-add to `app.module.ts` declarations — we'll verify in the next step.

## Step 4: Verify module declaration

```bash
grep -n "<ComponentName>" src/app/app.module.ts
```

If not found, add the import and declaration manually to `src/app/app.module.ts`:
```typescript
import { <Name>Component } from './components/<path>/<name>.component';

@NgModule({
  declarations: [
    // existing...
    <Name>Component,
  ],
```

## Step 5: Apply the correct template

**If smart** — replace the generated `.ts` content with:
```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DataService, <Type> } from '../../services/data.service';

@Component({
  selector: 'app-<name>',
  templateUrl: './<name>.component.html',
  styleUrls: ['./<name>.component.scss'],
  standalone: false
})
export class <Name>Component implements OnInit, OnDestroy {
  items: <Type>[] = [];
  private destroy$ = new Subject<void>();

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.get<Type>s().pipe(
      takeUntil(this.destroy$)
    ).subscribe(items => {
      this.items = items;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**If dumb** — replace the generated `.ts` content with:
```typescript
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { <Type> } from '../../services/data.service';

@Component({
  selector: 'app-<name>',
  templateUrl: './<name>.component.html',
  styleUrls: ['./<name>.component.scss'],
  standalone: false
})
export class <Name>Component {
  @Input() item!: <Type>;
}
```

## Step 6: Next steps

Ask: "Component `app-<name>` is ready. Where should it appear? Tell me which template to add `<app-<name>>` to, or what content it should display."
```

- [ ] **Step 2: Verify**

```bash
head -5 .claude/skills/new-component.md
```
Expected: `---`

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/new-component.md
git commit -m "Add new-component skill"
```

---

## Task 8: deploy skill

**Files:**
- Create: `.claude/skills/deploy.md`

- [ ] **Step 1: Create deploy skill**

Create `.claude/skills/deploy.md`:

```markdown
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
```

- [ ] **Step 2: Verify**

```bash
head -5 .claude/skills/deploy.md
```
Expected: `---`

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/deploy.md
git commit -m "Add deploy skill"
```

---

## Task 9: dev-start skill

**Files:**
- Create: `.claude/skills/dev-start.md`

- [ ] **Step 1: Create dev-start skill**

Create `.claude/skills/dev-start.md`:

```markdown
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
```

- [ ] **Step 2: Verify**

```bash
head -5 .claude/skills/dev-start.md
```
Expected: `---`

- [ ] **Step 3: Commit**

```bash
git add .claude/skills/dev-start.md
git commit -m "Add dev-start skill"
```

---

## Task 10: Register skills in settings

**Files:**
- Modify: `.claude/settings.local.json`

- [ ] **Step 1: Use the update-config skill to register local skills**

Invoke the `update-config` skill to add the `.claude/skills/` directory to the Claude Code settings so the skills appear as invokable commands.

If `update-config` doesn't handle skill registration directly, manually add the skills directory to `.claude/settings.local.json`. Read the current file first, then add the skills path.

- [ ] **Step 2: Verify skills are discoverable**

Start a new Claude Code session in this project and check the system-reminder or run `/add-content-type` to confirm the skill loads.

- [ ] **Step 3: Commit any settings changes**

```bash
git add .claude/settings.local.json
git commit -m "Register local skills in Claude Code settings"
```

---

## Self-Review

**Spec coverage check:**
- ✅ CLAUDE.md — Task 1
- ✅ content-manager agent — Task 2
- ✅ component-generator agent — Task 3
- ✅ deploy agent — Task 4
- ✅ debug agent — Task 5
- ✅ add-content-type skill — Task 6
- ✅ new-component skill — Task 7
- ✅ deploy skill — Task 8
- ✅ dev-start skill — Task 9
- ✅ Skill registration — Task 10

**Placeholder scan:** No TBDs, TODOs, or vague steps. All file content is explicit.

**Type consistency:** DataService method pattern is identical in CLAUDE.md, content-manager agent, and add-content-type skill. Component templates match app.module.ts patterns observed in codebase.
