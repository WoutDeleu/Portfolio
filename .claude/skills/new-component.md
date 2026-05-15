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

> Import path depth depends on nesting: 2 levels deep (`components/foo/`) use `../../services/data.service`; 3 levels deep (`components/cards/foo/`) use `../../../services/data.service`.

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

> Add `@Output() eventName = new EventEmitter<Type>();` if this component needs to emit events to its parent.

## Step 6: Next steps

Ask: "Component `app-<name>` is ready. Where should it appear? Tell me which template to add `<app-<name>>` to, or what content it should display."
