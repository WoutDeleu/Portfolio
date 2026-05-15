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
