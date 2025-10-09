# Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the Portfolio application to various environments, with a focus on GitHub Pages as the primary deployment target.

## 🚀 GitHub Pages Deployment (Recommended)

### Automatic Deployment

The project is configured for automatic deployment to GitHub Pages using GitHub Actions.

#### Prerequisites
1. GitHub repository with the portfolio code
2. GitHub Pages enabled in repository settings
3. Repository must be public (for free GitHub Pages)

#### Setup Steps

1. **Enable GitHub Pages**
   - Go to repository Settings > Pages
   - Source: "GitHub Actions"
   - No need to select a branch as Actions will handle deployment

2. **Verify Workflow File**
   ```yaml
   # .github/workflows/deploy.yml should exist with proper configuration
   ```

3. **Push to Main Branch**
   ```bash
   git push origin main
   ```

4. **Monitor Deployment**
   - Go to repository Actions tab
   - Watch the "Deploy to GitHub Pages" workflow
   - Deployment typically takes 3-5 minutes

#### Workflow Details

The GitHub Actions workflow automatically:
- Sets up Node.js 20.x environment
- Clears npm cache for clean builds
- Installs dependencies with fresh package-lock.json
- Installs Angular CLI globally
- Syncs content from `/content` to `/src/assets/data`
- Builds for production with correct base-href
- Deploys to GitHub Pages

#### Access Your Site
After successful deployment, your site will be available at:
```
https://[username].github.io/[repository-name]/
```

### Manual GitHub Pages Deployment

If you need to deploy manually:

1. **Install Angular CLI Globally**
   ```bash
   npm install -g @angular/cli@latest
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Sync Content**
   ```bash
   npm run sync-content
   ```

4. **Build for Production**
   ```bash
   ng build --configuration production --base-href="/[repository-name]/"
   ```

5. **Deploy Using gh-pages**
   ```bash
   npx angular-cli-ghpages --dir=docs
   ```

---

## 🌐 Alternative Deployment Options

### Netlify Deployment

#### Method 1: Git Integration (Recommended)

1. **Connect Repository**
   - Create Netlify account
   - Connect your GitHub repository
   - Select the repository containing your portfolio

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: docs
   ```

3. **Environment Variables**
   ```
   NODE_VERSION: 20
   ```

4. **Deploy Settings**
   ```yaml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = "docs"

   [build.environment]
     NODE_VERSION = "20"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

#### Method 2: Manual Upload

1. **Build Locally**
   ```bash
   npm run build
   ```

2. **Upload docs/ Directory**
   - Drag and drop the `docs` folder to Netlify dashboard
   - Or use Netlify CLI

### Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Configure Project**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "docs",
     "framework": "angular"
   }
   ```

### Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login and Initialize**
   ```bash
   firebase login
   firebase init hosting
   ```

3. **Configure firebase.json**
   ```json
   {
     "hosting": {
       "public": "docs",
       "ignore": [
         "firebase.json",
         "**/.*",
         "**/node_modules/**"
       ],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   firebase deploy
   ```

---

## 🔧 Build Configuration

### Production Build Settings

The production build is optimized for performance:

```json
{
  "production": {
    "budgets": [
      {
        "type": "initial",
        "maximumWarning": "20mb",
        "maximumError": "25mb"
      },
      {
        "type": "anyComponentStyle",
        "maximumWarning": "50kb",
        "maximumError": "100kb"
      }
    ],
    "outputHashing": "all",
    "fileReplacements": [
      {
        "replace": "src/environments/environment.ts",
        "with": "src/environments/environment.production.ts"
      }
    ]
  }
}
```

### Build Optimizations Applied

- **Tree Shaking**: Removes unused code
- **Minification**: Compresses JavaScript and CSS
- **Output Hashing**: Adds hash to filenames for cache busting
- **Bundle Budgets**: Monitors and limits bundle sizes
- **Source Map Generation**: Disabled in production for smaller builds

### Environment Configuration

#### Development Environment
```typescript
// src/environments/environment.development.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:4200',
  enableLogging: true
};
```

#### Production Environment
```typescript
// src/environments/environment.production.ts
export const environment = {
  production: true,
  apiUrl: 'https://yourdomain.com',
  enableLogging: false
};
```

---

## 📁 Content Synchronization

### Automatic Content Sync

Content from `/content` directory is automatically synced during build:

```bash
# Sync command (defined in package.json)
npm run sync-content

# Equivalent to:
rsync -av --delete content/ src/assets/data/
```

### Manual Content Management

1. **Update Content Files**
   ```bash
   # Edit files in /content directory
   nano content/personal/info.json
   ```

2. **Sync to Assets**
   ```bash
   npm run sync-content
   ```

3. **Verify Sync**
   ```bash
   ls -la src/assets/data/
   ```

4. **Build and Deploy**
   ```bash
   npm run build
   ```

### Content Validation

Before deployment, validate your content files:

```bash
# Check JSON validity
for file in content/**/*.json; do
  echo "Validating $file"
  cat "$file" | jq . > /dev/null && echo "✓ Valid" || echo "✗ Invalid JSON"
done
```

---

## 🔍 Deployment Troubleshooting

### Common Issues and Solutions

#### Build Failures

**Issue**: `Error: Cannot find module '@angular/cli'`
```bash
# Solution: Install Angular CLI globally
npm install -g @angular/cli@latest
```

**Issue**: `Build optimization failed`
```bash
# Solution: Clear cache and rebuild
rm -rf .angular/cache
npm run build
```

**Issue**: `Content not syncing`
```bash
# Solution: Manual sync
npm run sync-content
```

#### GitHub Pages Issues

**Issue**: Site shows 404 after deployment
- **Solution**: Check that base-href matches repository name
- **Fix**: `ng build --base-href="/[repository-name]/"`

**Issue**: Actions workflow fails
- **Solution**: Check repository permissions
- **Required**: `contents: read`, `pages: write`, `id-token: write`

**Issue**: Old content still visible
- **Solution**: Hard refresh browser or clear cache
- **Browser**: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

#### Asset Loading Issues

**Issue**: Fonts or icons not loading
```typescript
// Check font URLs in index.html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono" rel="stylesheet">
<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
```

**Issue**: Images not displaying
- **Solution**: Verify image paths relative to assets folder
- **Correct**: `assets/images/photo.jpg`
- **Incorrect**: `/images/photo.jpg`

### Performance Optimization

#### Bundle Size Analysis
```bash
# Analyze bundle size
npm install -g webpack-bundle-analyzer
ng build --stats-json
npx webpack-bundle-analyzer docs/stats.json
```

#### Loading Performance
```bash
# Enable source maps for debugging
ng build --source-map

# Check lighthouse scores
npx lighthouse https://yourdomain.com --output html --output-path ./lighthouse-report.html
```

---

## 🔒 Security Considerations

### Environment Variables

**Never commit sensitive data:**
- EmailJS private keys
- API secrets
- Personal information

**Use environment files:**
```typescript
// Safe for client-side
export const environment = {
  production: true,
  emailjs: {
    serviceId: 'service_id',
    templateId: 'template_id',
    publicKey: 'public_key'  // Safe to expose
  }
};
```

### Content Security Policy

Add CSP headers for enhanced security:

```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  script-src 'self';
  img-src 'self' data: https:;
">
```

### HTTPS Enforcement

Ensure HTTPS is enabled:
- GitHub Pages: Automatic HTTPS
- Netlify: Automatic HTTPS with Let's Encrypt
- Firebase: Automatic HTTPS
- Custom domains: Configure SSL certificate

---

## 📊 Monitoring and Analytics

### GitHub Pages Analytics

Monitor deployment status:
- **Actions Tab**: View workflow runs
- **Deployments**: Check deployment history
- **Pages Settings**: Monitor custom domain status

### Performance Monitoring

#### Google Lighthouse
```bash
# Install lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://yourdomain.com --output html
```

#### Core Web Vitals
Monitor key metrics:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

### Error Tracking

Implement error tracking:

```typescript
// In app.component.ts
export class AppComponent {
  constructor() {
    // Log errors in production
    if (environment.production) {
      window.addEventListener('error', (error) => {
        console.error('Application error:', error);
        // Send to monitoring service
      });
    }
  }
}
```

---

## 🔄 CI/CD Pipeline Details

### GitHub Actions Workflow

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Clear npm cache
      run: npm cache clean --force

    - name: Install dependencies
      run: |
        rm -rf node_modules package-lock.json
        npm install

    - name: Install Angular CLI
      run: npm install -g @angular/cli@latest

    - name: Build for production
      run: ng build --configuration production --base-href="/Portfolio/"

    - name: Setup Pages
      uses: actions/configure-pages@v4

    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: ./docs

    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

### Pipeline Stages

1. **Environment Setup**
   - Ubuntu latest runner
   - Node.js 20.x
   - npm cache configuration

2. **Dependency Installation**
   - Clean npm cache
   - Fresh dependency installation
   - Global Angular CLI installation

3. **Build Process**
   - Content synchronization
   - Production build with optimizations
   - Correct base-href for GitHub Pages

4. **Deployment**
   - Pages artifact upload
   - Automatic deployment to GitHub Pages

### Pipeline Monitoring

Monitor your pipeline:
- **Status Badges**: Add to README
- **Notifications**: Configure GitHub notifications
- **Logs**: Review detailed logs for troubleshooting

```markdown
![Deploy Status](https://github.com/username/portfolio/actions/workflows/deploy.yml/badge.svg)
```

---

## 📝 Deployment Checklist

### Pre-Deployment
- [ ] All content files are valid JSON
- [ ] Images and assets are optimized
- [ ] EmailJS configuration is correct
- [ ] Environment variables are set
- [ ] Tests are passing
- [ ] Build succeeds locally

### GitHub Pages Specific
- [ ] Repository is public (for free tier)
- [ ] GitHub Pages is enabled in settings
- [ ] Base-href matches repository name
- [ ] Workflow file is present and correct
- [ ] Required permissions are granted

### Post-Deployment
- [ ] Site loads correctly
- [ ] All pages are accessible
- [ ] Forms work properly
- [ ] Images and fonts load
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable

### SEO and Accessibility
- [ ] Meta tags are present
- [ ] Alt text for images
- [ ] Proper heading structure
- [ ] Color contrast is sufficient
- [ ] Keyboard navigation works

---

*Last updated: September 2025*