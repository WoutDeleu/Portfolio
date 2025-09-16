# **Dynamic Portfolio Website - Project Description**

## **Project Overview**
A modern, dual-interface portfolio website built with Angular 20.3, designed for complete content management through configuration files without code changes. The application features two distinct viewing modes: a terminal-style interface and a traditional timeline-based portfolio view.

## **Core Architecture**

### **Technology Stack**
- **Frontend**: Angular 20.3 with TypeScript 5.8
- **Styling**: SCSS with Angular Material Design components
- **Data Management**: JSON-based configuration system
- **Build**: Angular CLI with GitHub Pages deployment support
- **Dependencies**: RxJS, Angular CDK, EmailJS integration

### **Data-Driven Design Philosophy**
The entire portfolio content is managed through JSON configuration files located in `src/app/models/data/`. The system uses a robust TypeScript model system that automatically parses JSON data into strongly-typed objects, ensuring type safety while maintaining flexibility.

## **Key Features & Views**

### **1. Terminal Interface (Inspired by fkcodes.com)**
- **Location**: `src/app/components/terminalview/terminal/`
- **Purpose**: Interactive command-line interface for portfolio navigation
- **Features**:
  - Custom ASCII art introduction featuring Wout Deleu as:
    - Backend Developer & Software Architect
    - Problem Solver & Analytical Thinker
    - Badminton Trainer (West-Flemish Youth Selection) & Competitive Player
    - Tech Enthusiast & Full-Stack Explorer
  - Command parsing and dynamic responses
  - Terminal aesthetics with personal branding
- **Data Source**: Person model with command mappings and ASCII art assets

### **2. Timeline Portfolio View (Default)**
- **Location**: Various components in `src/app/components/`
- **Purpose**: Comprehensive portfolio presentation with unified timeline system
- **Timeline Views**:
  - **Global Timeline**: Combined chronological view of all events (experiences, education, projects, certificates)
  - **Professional Experience**: Focused view of work history and career progression
  - **Education & Certificates**: Combined academic achievements and professional certifications
  - **Projects**: Personal and professional project showcase with technical details

### **3. Personal Profile View**
- **Purpose**: Static introduction and skills showcase
- **Sections**:
  - **Personal Introduction**: Bio highlighting backend expertise, problem-solving skills, and sports achievements
  - **Technical Skills**: Programming languages, frameworks, and proficiency levels
  - **Languages**: Spoken language proficiencies
  - **Certifications**: Professional certifications (PSM I, OCP, Industrial Engineering)
  - **Interests**: Sports (Badminton, Running, Swimming), Tech exploration, Cybersecurity

## **Data Model Structure**

### **Person Model** (`src/app/models/Person.ts`)
Central data model containing:
- Personal information (Wout Deleu, Backend Developer, Belgium)
- Professional summary emphasizing analytical thinking and problem-solving
- Social media links (GitHub, LinkedIn)
- Collections of: skills, educations, certificates, experiences, languages, projects, interests
- ASCII art assets for terminal interface

### **Unified Event System** (`src/app/models/events/`)
Streamlined event system supporting:
- **Global Timeline**: All events in chronological order
- **PeriodEvent**: Events with start/end dates (jobs, education, projects)
- **SingleEvent**: Point-in-time events (certificates, achievements)
- **Automatic Categorization**: Events tagged by type for filtered views

### **Company/Organization Data** (`src/app/models/properties/`)
Support for:
- Company information (AXXES, KU Leuven, etc.)
- Educational institutions with logos and websites
- Certification bodies and achievement details
- Technology stacks and tools used

## **Configuration System**

### **Primary Data File**: `src/app/models/data/WoutDeleu.json`
Complete portfolio data including:
```json
{
  "firstName": "Wout",
  "lastName": "Deleu",
  "function": "Backend Developer & Software Architect",
  "aboutMe": "Analytical thinker, problem solver, tech enthusiast, and competitive badminton player...",
  "skills": [
    {"name": "Python", "percentage": 95},
    {"name": "Java", "percentage": 90},
    {"name": "C++", "percentage": 85},
    {"name": "Angular", "percentage": 80}
  ],
  "experiences": [...],
  "educations": [...],
  "projects": [...],
  "certificates": [
    {"title": "PSM I - Professional Scrum Master I"},
    {"title": "OCP - Oracle Certified Professional"},
    {"title": "Industrial Engineering (Electronics & ICT) - KU Leuven"}
  ],
  "languages": [...],
  "interests": ["Badminton Training & Competition", "Backend Development", "Problem Solving", "Sports"]
}
```

### **ASCII Art Assets**
- Terminal introduction art: `src/assets/ascii/intro.txt`
- Personal branding elements
- Command help displays

### **Assets Management**
- Profile images: `src/assets/images/Profile/`
- Company/institution logos: Configurable URLs in JSON
- Icons and favicons: `src/assets/icons/`
- ASCII art files: `src/assets/ascii/`

## **Component Architecture**

### **Core Components**
- **Global Timeline**: Unified chronological event display
- **Timeline Filters**: Switch between Global, Professional, Education/Certificates, Projects
- **Personal Profile**: Skills, languages, and introduction showcase
- **Terminal Interface**: Interactive CLI with ASCII art introduction
- **Navigation System**: Seamless switching between timeline and terminal views

### **Reusable Components**
- **Age Badge**: Dynamic age calculation from birth date
- **Location Badge**: Geographic information display (Belgium)
- **Skills Matrix**: Visual representation of technical proficiencies
- **Event Cards**: Unified design for all timeline events
- **Contact Integration**: Professional contact methods
- **Achievement Badges**: Certifications and accomplishments display

### **Utility Functions**
- **Date Functions**: `src/app/utils/DateFunctions.ts` - Date parsing and formatting
- **Timeline Merger**: Combine and sort events from different categories
- **ASCII Loader**: Terminal art rendering utilities

## **Styling & Design System**

### **SCSS Architecture**
- **Main Styles**: `src/assets/styles/styles.scss`
- **Color System**: `src/assets/styles/colors.scss`
- **Timeline Styles**: Unified styling for all event types
- **Terminal Theme**: Authentic command-line aesthetics
- **Material Design**: Angular Material integration

### **Design Requirements**
- **Professional Aesthetics**: Clean, developer-focused design
- **Responsive Design**: Mobile-first approach
- **Dynamic Animations**: Smooth transitions between timeline views
- **Unified Timeline**: Consistent visual language across all event types
- **Terminal Authenticity**: Retro computing aesthetic with modern polish

## **Timeline Structure**

### **Global Timeline**
- **All Events**: Chronological display of experiences, education, projects, certificates
- **Visual Indicators**: Color-coded event types
- **Interactive Filtering**: Quick access to specific categories

### **Specialized Views**
1. **Professional Experience**: Career progression and work achievements
2. **Education & Certificates**: Academic background and professional certifications combined
3. **Projects**: Technical projects with technology stacks and outcomes

## **Deployment & Build**

### **Build Configuration**
- **Output**: `docs/` directory for GitHub Pages
- **Environments**: Development and production configurations
- **Assets Optimization**: Image and bundle optimization
- **CI/CD**: Angular CLI GitHub Pages integration

## **Development Workflow**

### **Content Updates**
1. Modify JSON configuration files (especially WoutDeleu.json)
2. Update ASCII art assets for terminal interface
3. Add new project/experience assets
4. Run build process
5. Deploy to GitHub Pages

### **Component Development**
1. Create reusable Angular components
2. Integrate with unified timeline system
3. Implement responsive styling
4. Add animations and transitions

## **Future Enhancements**
- **Enhanced Terminal Commands**: More interactive CLI features
- **Project Deep Dives**: Detailed project case studies
- **Skills Visualization**: Interactive skill progression charts
- **Sports Achievements**: Badminton competition results and training philosophy
- **Blog Integration**: Technical articles and insights
- **Analytics Integration**: Visitor tracking and engagement metrics
- **Multi-language Support**: Dutch/English language switching
- **Dark/Light Themes**: Professional theming options

## **AI Development Context**
This project is designed for "vibe coding" - rapid development through AI assistance. The JSON-driven architecture allows for easy content updates featuring Wout Deleu's professional journey as a backend developer, problem solver, and badminton enthusiast. The modular component system enables incremental improvements while maintaining the unified timeline philosophy.

---

**Use this description to provide context to AI tools for developing, enhancing, or maintaining Wout Deleu's portfolio website. Focus on the unified timeline approach, terminal interface with personal ASCII art, and the data-driven philosophy that allows content updates without code modifications.**

---

**Key Personal Elements to Implement:**
- ASCII art introduction highlighting backend development expertise
- Unified timeline combining all professional and educational milestones
- Skills showcase emphasizing Python, Java, C++, and Angular
- Sports achievements integration (badminton training and competition)
- Problem-solving and analytical thinking emphasis throughout the design
