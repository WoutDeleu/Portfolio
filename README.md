# Personal Portfolio Website 🌐

A modern, responsive portfolio website built with Angular 20, featuring a clean design and comprehensive contact functionality.

## 🚀 Features

### Core Functionality
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Contact Form**: Advanced contact form with EmailJS integration
- **Data-Driven Content**: JSON-based content management system
- **Terminal View**: Interactive terminal-style interface
- **Animation System**: Smooth transitions and scroll animations
- **Theme Support**: Light/dark theme toggle capability

### Components
- **Navigation Bar**: Responsive navigation with smooth scrolling
- **Skills Cards**: Dynamic skill visualization with categorization
- **Contact Form**: Multi-field form with phone number formatting and validation
- **Portfolio Section**: Project showcase with filtering capabilities
- **Badge Components**: Age and location badges with real-time updates
- **Download CV**: Direct CV download functionality

### Technical Features
- **Angular 20**: Latest Angular framework with standalone components support
- **Angular Material**: Material Design components and theming
- **SCSS Styling**: Modular stylesheet architecture
- **TypeScript**: Full type safety and modern JavaScript features
- **Content Sync**: Automated content synchronization from external JSON files
- **GitHub Pages Deployment**: Automated CI/CD pipeline

## 📁 Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── badges/          # Age and location badges
│   │   │   ├── cards/           # Skill cards and content cards
│   │   │   ├── contact-form/    # Contact form with validation
│   │   │   ├── navigation-bar/  # Main navigation
│   │   │   ├── overview/        # Portfolio overview
│   │   │   ├── portfolio/       # Portfolio showcase
│   │   │   └── terminalview/    # Terminal interface
│   │   ├── models/              # Data models and interfaces
│   │   │   ├── data/           # JSON data structures
│   │   │   ├── events/         # Event-based models
│   │   │   └── properties/     # Property models
│   │   ├── services/           # Angular services
│   │   │   ├── data.service.ts # Data management
│   │   │   └── email.service.ts # Email functionality
│   │   ├── directives/         # Custom directives
│   │   └── utils/              # Utility functions
│   ├── assets/
│   │   ├── data/              # Synced content from /content
│   │   ├── icons/             # Application icons
│   │   └── styles/            # Global styles
│   └── environments/          # Environment configurations
├── content/                   # External content management
│   ├── certifications/        # Professional certifications
│   ├── education/            # Educational background
│   ├── interests/            # Personal interests
│   ├── languages/            # Programming languages
│   ├── personal/             # Personal information
│   ├── skills/               # Technical skills
│   └── social-media/         # Social media links
├── docs/                     # Build output for GitHub Pages
└── .github/workflows/        # CI/CD automation
```

## 🛠️ Technology Stack

### Frontend Framework
- **Angular 20.3.0**: Modern web application framework
- **Angular Material 20.2.3**: Material Design component library
- **Angular CDK**: Component development kit for advanced UI patterns

### Styling & UI
- **SCSS**: Advanced CSS with variables and mixins
- **Material Icons**: Google's Material Design icon library
- **JetBrains Mono**: Monospace font for code and terminal components
- **Responsive Design**: Mobile-first approach with flexbox/grid

### Form Management
- **Angular Reactive Forms**: Type-safe form handling
- **Custom Validators**: Phone number and email validation
- **Dynamic Formatting**: Real-time phone number formatting
- **Country Code Support**: International phone number handling

### Email Integration
- **EmailJS 3.11.0**: Client-side email sending
- **Template System**: Customizable email templates
- **Configuration Management**: External email configuration

### Location Services
- **country-cities 1.0.8**: City and country data
- **all-the-cities 3.1.0**: Comprehensive city database
- **Coordinate Mapping**: Geographic coordinate resolution

### Development Tools
- **TypeScript 5.8.3**: Static typing and modern JavaScript
- **Angular CLI 20.3.1**: Command-line interface and build tools
- **Karma & Jasmine**: Unit testing framework
- **ESLint**: Code quality and style enforcement

## 🚀 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Angular CLI (installed globally)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/username/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Sync content**
   ```bash
   npm run sync-content
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   ng serve
   ```

5. **Open in browser**
   ```
   http://localhost:4200
   ```

## 📝 Content Management

### Overview
All portfolio content is managed through JSON files in the `/content` directory. This separation allows for easy updates without touching the codebase.

### Content Structure

#### Personal Information (`content/personal/info.json`)
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "birthDate": "1990-01-01",
  "title": "Full Stack Developer",
  "description": "Passionate developer with expertise in...",
  "contact": {
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, USA"
  },
  "education": {
    "degree": "Bachelor of Computer Science",
    "university": "University Name",
    "period": "2008-2012"
  }
}
```

#### Skills (`content/skills/*.json`)
```json
{
  "id": "angular",
  "name": "Angular",
  "description": "Frontend framework for building scalable applications",
  "icon": "<svg>...</svg>",
  "color": "#DD0031",
  "order": 1
}
```

#### Social Media (`content/social-media/*.json`)
```json
{
  "id": "github",
  "name": "GitHub",
  "url": "https://github.com/username",
  "icon": "<svg>...</svg>",
  "color": "#181717",
  "order": 1
}
```

### Content Sync Process
Content from `/content` is automatically synced to `/src/assets/data/` during:
- Development server startup (`npm start`)
- Build process (`npm run build`)
- Manual sync (`npm run sync-content`)

## 🎯 Build & Deployment

### Development Build
```bash
npm run build
# Outputs to /docs directory
```

### Production Build
```bash
ng build --configuration production
# Optimized build with minification and tree-shaking
```

### GitHub Pages Deployment
The project includes automated deployment to GitHub Pages via GitHub Actions:

1. **Automatic Deployment**: Triggered on push to `main` branch
2. **Build Process**: Installs dependencies, syncs content, and builds for production
3. **Deployment**: Uploads build artifacts to GitHub Pages

#### Deployment Configuration
- **Base URL**: Configured for GitHub Pages subdirectory
- **Output Directory**: `docs/` (GitHub Pages source)
- **Node Version**: 20.x LTS
- **Build Command**: `ng build --configuration production --base-href="/Portfolio/"`

## 🧪 Testing

### Unit Testing
```bash
npm test
# Runs Karma test runner with Jasmine
```

### Component Testing
- **Contact Form**: Validation logic and form submission
- **Data Service**: API integration and data transformation
- **Badge Components**: Age calculation and location formatting
- **Navigation**: Routing and scroll behavior

### Test Coverage
- **Models**: Data transformation and validation
- **Services**: API integration and email functionality
- **Components**: User interaction and state management

## 🔧 Configuration

### Email Configuration
Create `src/assets/config/email-config.json`:
```json
{
  "recipientEmail": "your.email@example.com",
  "emailService": {
    "provider": "emailjs",
    "serviceId": "your_service_id",
    "templateId": "your_template_id",
    "publicKey": "your_public_key"
  }
}
```

### Environment Variables
- **Development**: `src/environments/environment.development.ts`
- **Production**: `src/environments/environment.production.ts`

### Angular Configuration
- **Build Options**: Configured in `angular.json`
- **TypeScript**: Configuration in `tsconfig.json`
- **Styling**: SCSS compilation and asset management

## 📚 API Documentation

### Data Service Methods

#### `getPersonalInfo(): Observable<PersonalInfo>`
Retrieves personal information from content files.

#### `getInterests(): Observable<Interest[]>`
Returns array of interests sorted by order.

#### `getSocialMedia(): Observable<SocialMedia[]>`
Fetches social media links and profiles.

#### `getCertifications(): Observable<Certification[]>`
Gets professional certifications and achievements.

#### `getEducation(): Observable<Education[]>`
Retrieves educational background information.

### Email Service Methods

#### `sendEmail(formData: ContactFormData): Promise<EmailJSResponseStatus>`
Sends email using EmailJS with form data validation.

#### `getRecipientEmail(): string`
Returns configured recipient email address.

### Data Models

#### PersonalInfo Interface
```typescript
interface PersonalInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
  title: string;
  description: string;
  contact?: ContactInfo;
  education?: EducationInfo;
}
```

#### ContactFormData Interface
```typescript
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  telNr?: string;
  allowedToCall?: boolean;
}
```

## 🎨 Styling Architecture

### SCSS Structure
- **Global Styles**: `src/assets/styles/styles.scss`
- **Component Styles**: Scoped SCSS files per component
- **Material Theming**: Custom Angular Material theme
- **Responsive Breakpoints**: Mobile-first responsive design

### CSS Custom Properties
- **Color Schemes**: Light and dark theme variables
- **Typography**: Font sizing and spacing scales
- **Animations**: Transition timing and easing functions

## 🔍 Performance Optimization

### Build Optimization
- **Tree Shaking**: Removes unused code from bundles
- **Minification**: Compresses JavaScript and CSS
- **Code Splitting**: Lazy loading for route-based chunks
- **Asset Optimization**: Image compression and format optimization

### Runtime Performance
- **OnPush Change Detection**: Optimized component updates
- **Lazy Loading**: Route-based code splitting
- **Service Workers**: Caching for offline functionality (future enhancement)

## 🐛 Troubleshooting

### Common Issues

#### Content Not Syncing
```bash
# Manual sync
npm run sync-content

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors
```bash
# Clear Angular cache
rm -rf .angular/cache

# Rebuild
ng build --configuration production
```

#### Email Form Not Working
1. Check EmailJS configuration in assets/config/
2. Verify service ID and template ID
3. Test with browser developer tools

#### GitHub Pages Deployment Issues
1. Check GitHub Actions logs
2. Verify repository settings for Pages
3. Ensure base-href matches repository name

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Make changes and test thoroughly
4. Update content files if needed
5. Commit changes: `git commit -m "Add new feature"`
6. Push to branch: `git push origin feature/new-feature`
7. Submit pull request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Follow configured rules
- **Component Structure**: Use Angular style guide
- **Testing**: Maintain test coverage above 80%

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Wout Deleu**
- **Email**: wout.deleu@gmail.com
- **LinkedIn**: [Your LinkedIn Profile]
- **GitHub**: [Your GitHub Profile]

---

## 🔄 Recent Updates

### Version 1.0.0 (Current)
- ✅ Angular 20 upgrade completed
- ✅ Contact form with phone validation
- ✅ JSON-based content management
- ✅ GitHub Pages deployment automation
- ✅ Responsive design implementation
- ✅ EmailJS integration
- ✅ Terminal view component

### Upcoming Features
- 🔄 Service Worker for offline support
- 🔄 Advanced portfolio filtering
- 🔄 Blog section integration
- 🔄 Dark/light theme toggle
- 🔄 Multi-language support
- 🔄 Analytics integration

---

*Last updated: September 2025*