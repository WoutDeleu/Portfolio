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
