# Development Guide

## Overview

This guide provides comprehensive instructions for setting up, developing, and contributing to the Portfolio application.

## 🛠️ Development Environment Setup

### Prerequisites

#### System Requirements
- **Node.js**: 18.x or higher (LTS recommended)
- **npm**: 9.x or higher
- **Git**: Latest version
- **Code Editor**: VS Code (recommended) or your preferred editor

#### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "angular.ng-template",
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Initial Setup

1. **Clone Repository**
   ```bash
   git clone https://github.com/username/portfolio.git
   cd portfolio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Verify Angular CLI**
   ```bash
   # Install globally if not present
   npm install -g @angular/cli@latest

   # Verify installation
   ng version
   ```

4. **Sync Content**
   ```bash
   npm run sync-content
   ```

5. **Start Development Server**
   ```bash
   npm start
   # or
   ng serve
   ```

6. **Open in Browser**
   ```
   http://localhost:4200
   ```

### Verification Steps

After setup, verify everything works:
- [ ] Development server starts without errors
- [ ] Application loads in browser
- [ ] Hot reload works when editing files
- [ ] Content displays correctly
- [ ] Contact form can be accessed

---

## 📁 Project Architecture

### Directory Structure Deep Dive

```
portfolio/
├── src/
│   ├── app/
│   │   ├── components/              # UI Components
│   │   │   ├── badges/             # Reusable badge components
│   │   │   │   ├── age-badge/      # Age calculation display
│   │   │   │   └── location-badge/ # Location with coordinates
│   │   │   ├── cards/              # Content cards
│   │   │   │   └── skills/         # Skills visualization
│   │   │   ├── contact-form/       # Advanced contact form
│   │   │   ├── download-cv-button/ # CV download functionality
│   │   │   ├── navigation-bar/     # Main navigation
│   │   │   ├── overview/           # Portfolio overview page
│   │   │   ├── portfolio/          # Portfolio showcase
│   │   │   ├── terminalview/       # Terminal interface
│   │   │   └── toggle-switch/      # Theme toggle component
│   │   ├── directives/             # Custom Angular directives
│   │   │   └── scroll-animation.directive.ts
│   │   ├── models/                 # Data models and interfaces
│   │   │   ├── data/              # JSON data type definitions
│   │   │   ├── events/            # Event-based models (timeline)
│   │   │   └── properties/        # Property models (skills, etc.)
│   │   ├── services/              # Angular services
│   │   │   ├── data.service.ts    # Content management
│   │   │   └── email.service.ts   # Email functionality
│   │   └── utils/                 # Utility functions
│   │       └── DateFunctions.ts   # Date parsing utilities
│   ├── assets/
│   │   ├── data/                  # Synced content (auto-generated)
│   │   ├── icons/                 # Application icons
│   │   └── styles/                # Global SCSS files
│   └── environments/              # Environment configurations
├── content/                       # Content management (source)
├── docs/                         # Build output (GitHub Pages)
├── .angular/                     # Angular cache
└── .github/workflows/            # CI/CD automation
```

### Architecture Patterns

#### Component-Based Architecture
```
Page Components (Smart)
├── Feature Components (Smart/Dumb)
├── UI Components (Dumb)
└── Shared Components (Dumb)
```

#### Service Layer
```
Data Layer
├── DataService (Content Management)
├── EmailService (Communication)
└── Utility Services (Date, Location)
```

#### State Management
- **Local State**: Component-level state management
- **Service State**: Shared state through services
- **Observable Patterns**: RxJS for reactive programming

---

## 🧩 Component Development

### Component Creation

#### Generate New Component
```bash
# Standard component
ng generate component components/my-component

# Component with routing
ng generate component pages/my-page --routing

# Standalone component (Angular 14+)
ng generate component components/my-component --standalone
```

#### Component Structure Template
```typescript
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.scss'],
  standalone: false
})
export class MyComponentComponent implements OnInit, OnDestroy {
  @Input() inputProperty: string = '';
  @Output() outputEvent = new EventEmitter<string>();

  private destroy$ = new Subject<void>();

  constructor() { }

  ngOnInit(): void {
    // Initialize component
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Component methods
  handleEvent(): void {
    this.outputEvent.emit('event data');
  }
}
```

### Component Guidelines

#### Naming Conventions
- **Files**: `kebab-case.component.ts`
- **Classes**: `PascalCase` + `Component` suffix
- **Selectors**: `app-kebab-case`
- **Properties**: `camelCase`

#### Component Types

**Smart Components (Containers)**
- Manage state and data
- Interact with services
- Handle routing and navigation
- Minimal presentation logic

**Dumb Components (Presentational)**
- Display data through inputs
- Emit events through outputs
- No direct service interaction
- Reusable and testable

#### Best Practices
- Keep components focused and small
- Use OnPush change detection when possible
- Implement proper cleanup in ngOnDestroy
- Follow Angular style guide conventions
- Write unit tests for all components

---

## 🎨 Styling and Theming

### SCSS Architecture

#### File Structure
```
src/assets/styles/
├── styles.scss              # Global entry point
├── _variables.scss          # Design tokens
├── _mixins.scss            # Reusable mixins
├── _typography.scss        # Font definitions
├── _layout.scss           # Layout utilities
└── components/            # Component-specific styles
```

#### Global Styles
```scss
// styles.scss
@import 'variables';
@import 'mixins';
@import 'typography';
@import 'layout';

// Angular Material theme
@import '~@angular/material/theming';
@include mat-core();

// Custom theme colors
$primary: mat-palette($mat-indigo);
$accent: mat-palette($mat-pink, A200, A100, A400);
$warn: mat-palette($mat-red);

$theme: mat-light-theme($primary, $accent, $warn);
@include angular-material-theme($theme);
```

#### Component Styles
```scss
// component.component.scss
:host {
  display: block;

  .component-container {
    padding: 1rem;

    @include mobile {
      padding: 0.5rem;
    }
  }
}
```

### Responsive Design

#### Breakpoints
```scss
// _variables.scss
$breakpoints: (
  mobile: 480px,
  tablet: 768px,
  desktop: 1024px,
  large: 1200px
);

// _mixins.scss
@mixin mobile {
  @media (max-width: map-get($breakpoints, mobile)) {
    @content;
  }
}

@mixin tablet {
  @media (max-width: map-get($breakpoints, tablet)) {
    @content;
  }
}
```

#### Responsive Utilities
```scss
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  @include tablet {
    padding: 0 0.5rem;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;

  @include mobile {
    grid-template-columns: 1fr;
  }
}
```

---

## 🔧 Service Development

### Service Creation

#### Generate Service
```bash
ng generate service services/my-service
```

#### Service Template
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MyService {
  private readonly apiUrl = 'api/endpoint';
  private dataSubject = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) { }

  getData(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      retry(3),
      catchError(this.handleError),
      map(data => this.processData(data))
    );
  }

  private processData(data: any[]): any[] {
    // Process and transform data
    return data;
  }

  private handleError(error: any) {
    console.error('Service error:', error);
    return throwError(() => new Error('Service operation failed'));
  }
}
```

### Data Service Patterns

#### Content Loading Pattern
```typescript
@Injectable({
  providedIn: 'root'
})
export class ContentService {
  private readonly basePath = 'assets/data';

  constructor(private http: HttpClient) { }

  loadMultipleItems<T>(
    fileNames: string[],
    directory: string
  ): Observable<T[]> {
    const requests = fileNames.map(name =>
      this.http.get<T>(`${this.basePath}/${directory}/${name}.json`)
    );

    return forkJoin(requests).pipe(
      map(items => items.sort((a: any, b: any) => a.order - b.order)),
      catchError(error => {
        console.error(`Failed to load ${directory}:`, error);
        return of([]);
      })
    );
  }
}
```

#### Error Handling Strategy
```typescript
export class ErrorHandlingService {
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed:`, error);

      // Log to external service in production
      if (environment.production) {
        this.logError(operation, error);
      }

      // Return safe fallback
      return of(result as T);
    };
  }

  private logError(operation: string, error: any): void {
    // Send to monitoring service
  }
}
```

---

## 📝 Content Management

### Content Structure

#### Adding New Content Types

1. **Create JSON Schema**
   ```typescript
   // models/content/NewContentType.ts
   export interface NewContentType {
     id: string;
     title: string;
     description: string;
     order: number;
   }
   ```

2. **Add Content Files**
   ```bash
   mkdir content/new-content-type
   touch content/new-content-type/item1.json
   touch content/new-content-type/item2.json
   ```

3. **Update DataService**
   ```typescript
   // Add to DataService
   getNewContentType(): Observable<NewContentType[]> {
     const fileNames = ['item1', 'item2'];
     return this.loadMultipleItems<NewContentType>(
       fileNames,
       'new-content-type'
     );
   }
   ```

4. **Update Content Sync**
   ```bash
   npm run sync-content
   ```

### Content Validation

#### JSON Schema Validation
```bash
# Install ajv for JSON schema validation
npm install --save-dev ajv

# Create validation script
node scripts/validate-content.js
```

```javascript
// scripts/validate-content.js
const Ajv = require('ajv');
const fs = require('fs');
const path = require('path');

const ajv = new Ajv();

// Define schemas
const personalInfoSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    birthDate: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' }
  },
  required: ['firstName', 'lastName', 'birthDate']
};

// Validate content files
function validateContent() {
  const contentDir = path.join(__dirname, '..', 'content');
  // Validation logic here
}

validateContent();
```

### Content Guidelines

#### JSON Structure Standards
- Use consistent property naming (camelCase)
- Include `id` and `order` fields for all items
- Validate date formats (YYYY-MM-DD)
- Keep descriptions concise but informative
- Use absolute URLs for external links

#### SVG Icon Guidelines
```json
{
  "icon": "<svg viewBox=\"0 0 24 24\" fill=\"currentColor\"><path d=\"...\"/></svg>"
}
```

Requirements:
- Use `viewBox="0 0 24 24"` for consistency
- Include `fill="currentColor"` for theme compatibility
- Minimize SVG code (remove unnecessary attributes)
- Test icons in both light and dark themes

---

## 🧪 Testing Strategy

### Unit Testing

#### Test Setup
```bash
# Run tests
npm test

# Run tests with coverage
ng test --code-coverage

# Run tests in headless mode
ng test --watch=false --browsers=ChromeHeadless
```

#### Component Testing Template
```typescript
// component.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MyComponent } from './my-component.component';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MyComponent],
      imports: [/* required modules */],
      providers: [/* mock services */]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display input property', () => {
    component.inputProperty = 'test value';
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('.test-element'));
    expect(element.nativeElement.textContent).toContain('test value');
  });

  it('should emit output event', () => {
    spyOn(component.outputEvent, 'emit');

    component.handleEvent();

    expect(component.outputEvent.emit).toHaveBeenCalledWith('event data');
  });
});
```

#### Service Testing Template
```typescript
// service.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MyService } from './my-service.service';

describe('MyService', () => {
  let service: MyService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MyService]
    });

    service = TestBed.inject(MyService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should fetch data successfully', () => {
    const testData = [{ id: 1, name: 'test' }];

    service.getData().subscribe(data => {
      expect(data).toEqual(testData);
    });

    const req = httpTestingController.expectOne('api/endpoint');
    expect(req.request.method).toEqual('GET');
    req.flush(testData);
  });
});
```

### E2E Testing

#### Cypress Setup (Optional)
```bash
# Install Cypress
npm install --save-dev cypress

# Open Cypress
npx cypress open
```

#### E2E Test Example
```typescript
// cypress/e2e/contact-form.cy.ts
describe('Contact Form', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should submit contact form successfully', () => {
    cy.get('[data-cy=name-input]').type('John Doe');
    cy.get('[data-cy=email-input]').type('john@example.com');
    cy.get('[data-cy=subject-input]').type('Test Subject');
    cy.get('[data-cy=message-input]').type('Test message content');

    cy.get('[data-cy=submit-button]').click();

    cy.get('[data-cy=success-message]').should('be.visible');
  });
});
```

---

## 🔍 Debugging and Development Tools

### Angular DevTools

#### Installation
```bash
# Install Angular DevTools browser extension
# Available for Chrome and Firefox
```

#### Usage
- **Component Inspector**: Inspect component tree and properties
- **Profiler**: Analyze change detection and performance
- **Router Tree**: Visualize routing configuration

### Browser DevTools

#### Debugging TypeScript
1. Enable source maps in development
2. Set breakpoints in TypeScript files
3. Use console.log strategically
4. Leverage Angular DevTools for component state

#### Network Debugging
- Monitor XHR requests for data loading
- Check for CORS issues
- Verify asset loading
- Test offline scenarios

### VS Code Debugging

#### Launch Configuration
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "ng serve",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}"
    }
  ]
}
```

---

## 🚀 Build and Development Scripts

### Package.json Scripts

```json
{
  "scripts": {
    "ng": "ng",
    "start": "npm run sync-content && ng serve",
    "build": "npm run sync-content && ng build",
    "build:prod": "ng build --configuration production",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "test:ci": "ng test --watch=false --browsers=ChromeHeadless",
    "test:coverage": "ng test --code-coverage --watch=false",
    "lint": "ng lint",
    "sync-content": "rsync -av --delete content/ src/assets/data/",
    "analyze": "ng build --stats-json && npx webpack-bundle-analyzer docs/stats.json"
  }
}
```

### Development Workflow

#### Daily Development
```bash
# Start development with content sync
npm start

# In separate terminal for testing
npm run test

# For production build testing
npm run build:prod
```

#### Pre-commit Checklist
```bash
# Run linting
npm run lint

# Run tests
npm run test:ci

# Build for production
npm run build:prod

# Sync content
npm run sync-content
```

### Performance Analysis

#### Bundle Analysis
```bash
# Generate stats file
ng build --stats-json

# Analyze bundle
npx webpack-bundle-analyzer docs/stats.json
```

#### Performance Auditing
```bash
# Install lighthouse CLI
npm install -g lighthouse

# Run audit on local build
lighthouse http://localhost:4200 --output html
```

---

## 🤝 Contributing Guidelines

### Git Workflow

#### Branch Naming
```
feature/feature-name
bugfix/bug-description
hotfix/critical-fix
docs/documentation-update
```

#### Commit Messages
```
feat: add new contact form validation
fix: resolve mobile navigation issue
docs: update API documentation
style: format code with prettier
refactor: simplify data service logic
test: add unit tests for email service
```

#### Pull Request Process
1. Create feature branch from main
2. Make changes with proper commits
3. Update documentation if needed
4. Run tests and ensure they pass
5. Create pull request with description
6. Request code review
7. Address feedback and merge

### Code Review Checklist

#### Code Quality
- [ ] Follows Angular style guide
- [ ] Proper TypeScript types used
- [ ] No console.log statements in production code
- [ ] Error handling implemented
- [ ] Performance considerations addressed

#### Testing
- [ ] Unit tests written for new features
- [ ] Existing tests still pass
- [ ] Edge cases covered
- [ ] Mock services used appropriately

#### Documentation
- [ ] Code is self-documenting
- [ ] Complex logic has comments
- [ ] README updated if needed
- [ ] API documentation updated

---

## 📚 Resources and References

### Angular Resources
- [Angular Documentation](https://angular.io/docs)
- [Angular Style Guide](https://angular.io/guide/styleguide)
- [Angular Material](https://material.angular.io/)
- [RxJS Documentation](https://rxjs.dev/)

### Development Tools
- [Angular CLI](https://cli.angular.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [SCSS Documentation](https://sass-lang.com/documentation)
- [Jest Testing Framework](https://jestjs.io/)

### Best Practices
- [Angular Best Practices](https://angular.io/guide/best-practices)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [SCSS Best Practices](https://sass-guidelin.es/)
- [Git Best Practices](https://www.atlassian.com/git/tutorials/comparing-workflows)

---

*Last updated: September 2025*