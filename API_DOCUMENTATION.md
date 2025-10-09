# API Documentation

## Overview

This document provides comprehensive documentation for the Portfolio application's APIs, data structures, and service interfaces.

## 📡 Services

### DataService

The DataService handles all data retrieval operations for portfolio content.

**Location**: `src/app/services/data.service.ts`

#### Methods

##### `getPersonalInfo(): Observable<PersonalInfo>`
Retrieves personal information from the content management system.

**Returns**: Observable of PersonalInfo object
**Endpoint**: `assets/data/personal/info.json`
**Example**:
```typescript
this.dataService.getPersonalInfo().subscribe(info => {
  console.log(info.firstName, info.lastName);
});
```

##### `getInterests(): Observable<Interest[]>`
Fetches user interests sorted by order.

**Returns**: Observable array of Interest objects
**Files**: `assets/data/interests/*.json`
**Sorting**: Automatic by `order` field (ascending)
**Example**:
```typescript
this.dataService.getInterests().subscribe(interests => {
  interests.forEach(interest => console.log(interest.name));
});
```

##### `getSocialMedia(): Observable<SocialMedia[]>`
Retrieves social media links and profiles.

**Returns**: Observable array of SocialMedia objects
**Files**: `assets/data/social-media/*.json`
**Sorting**: Automatic by `order` field (ascending)
**Example**:
```typescript
this.dataService.getSocialMedia().subscribe(socialMedia => {
  const githubProfile = socialMedia.find(sm => sm.id === 'github');
});
```

##### `getCertifications(): Observable<Certification[]>`
Gets professional certifications and achievements.

**Returns**: Observable array of Certification objects
**Files**: `assets/data/certifications/*.json`
**Sorting**: Automatic by `order` field (ascending)
**Example**:
```typescript
this.dataService.getCertifications().subscribe(certs => {
  const activeCerts = certs.filter(cert => new Date(cert.expires) > new Date());
});
```

##### `getEducation(): Observable<Education[]>`
Retrieves educational background information.

**Returns**: Observable array of Education objects
**Files**: `assets/data/education/*.json`
**Sorting**: Automatic by `order` field (ascending)
**Example**:
```typescript
this.dataService.getEducation().subscribe(education => {
  const university = education.find(edu => edu.id === 'university-xyz');
});
```

---

### EmailService

The EmailService manages email functionality through EmailJS integration.

**Location**: `src/app/services/email.service.ts`

#### Configuration

The service loads configuration from `assets/config/email-config.json` or falls back to hardcoded values.

##### Email Configuration Structure
```typescript
interface EmailConfig {
  recipientEmail: string;
  emailService: {
    provider: string;
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
}
```

#### Methods

##### `sendEmail(formData: ContactFormData): Promise<EmailJSResponseStatus>`
Sends email using EmailJS with comprehensive form data.

**Parameters**:
- `formData`: ContactFormData object containing all form fields

**Returns**: Promise resolving to EmailJS response status

**Template Parameters Sent**:
```typescript
{
  to_email: string,      // Recipient email
  from_name: string,     // Sender name
  from_email: string,    // Sender email
  subject: string,       // Email subject
  message: string,       // Email body
  phone: string,         // Phone number or 'Not provided'
  can_call: string,      // 'Yes' or 'No'
  reply_to: string       // Reply-to email
}
```

**Example**:
```typescript
const formData: ContactFormData = {
  name: 'John Doe',
  email: 'john@example.com',
  subject: 'Inquiry',
  message: 'Hello world',
  telNr: '+32 470 12 34 56',
  allowedToCall: true
};

this.emailService.sendEmail(formData).then(response => {
  console.log('Email sent:', response.text);
}).catch(error => {
  console.error('Email failed:', error);
});
```

##### `getRecipientEmail(): string`
Returns the configured recipient email address.

**Returns**: String email address
**Default**: 'wout.deleu@gmail.com'

##### `getConfigLoaded(): Observable<boolean>`
Observable that emits when email configuration is loaded.

**Returns**: Observable boolean indicating load status

---

## 📊 Data Models

### PersonalInfo Interface

```typescript
interface PersonalInfo {
  firstName: string;
  lastName: string;
  birthDate: string;          // Format: YYYY-MM-DD
  title: string;
  description: string;
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
  };
  education?: {
    degree?: string;
    specialization?: string;
    university?: string;
    period?: string;
    location?: string;
  };
  professionalSummary?: string;
}
```

**Example JSON**:
```json
{
  "firstName": "Wout",
  "lastName": "Deleu",
  "birthDate": "1990-01-01",
  "title": "Full Stack Developer",
  "description": "Passionate developer with expertise in modern web technologies",
  "contact": {
    "email": "wout.deleu@gmail.com",
    "phone": "+32 470 12 34 56",
    "location": "Brussels, Belgium"
  },
  "education": {
    "degree": "Master of Computer Science",
    "university": "University of Brussels",
    "period": "2008-2013"
  }
}
```

### Interest Interface

```typescript
interface Interest {
  id: string;
  name: string;
  description: string;
  icon: string;               // SVG string
  color: string;              // Hex color code
  order: number;              // Display order
}
```

**Example JSON**:
```json
{
  "id": "technology",
  "name": "Technology",
  "description": "Passionate about emerging technologies and innovation",
  "icon": "<svg viewBox=\"0 0 24 24\">...</svg>",
  "color": "#2196F3",
  "order": 1
}
```

### SocialMedia Interface

```typescript
interface SocialMedia {
  id: string;
  name: string;
  url: string;
  icon: string | SafeHtml;    // SVG string or SafeHtml
  color: string;              // Hex color code
  order: number;              // Display order
}
```

**Example JSON**:
```json
{
  "id": "github",
  "name": "GitHub",
  "url": "https://github.com/username",
  "icon": "<svg viewBox=\"0 0 24 24\">...</svg>",
  "color": "#181717",
  "order": 1
}
```

### Certification Interface

```typescript
interface Certification {
  id: string;
  title: string;
  organization: string;
  logo?: string;
  logoImage?: string;
  credentialUrl: string;
  achieved: string;           // Date format: YYYY-MM-DD
  expires: string;            // Date format: YYYY-MM-DD
  description: string;
  tags?: string[];
  startDate: string;          // Date format: YYYY-MM-DD
  type: string;
  order: number;              // Display order
}
```

**Example JSON**:
```json
{
  "id": "spring-cert",
  "title": "Spring Professional Certification",
  "organization": "VMware",
  "credentialUrl": "https://credentials.example.com/123",
  "achieved": "2023-06-15",
  "expires": "2025-06-15",
  "description": "Professional certification in Spring Framework",
  "tags": ["Java", "Spring", "Backend"],
  "startDate": "2023-03-01",
  "type": "Professional",
  "order": 1
}
```

### Education Interface

```typescript
interface Education {
  id: string;
  title: string;
  subTitle: string;
  startDate: string;          // Date format: YYYY-MM-DD
  endDate: string;            // Date format: YYYY-MM-DD
  description: string;
  specialization: string;
  relevantCourses: string[];
  institution: {
    name: string;
    logo: string;
    website: string;
  };
  order: number;              // Display order
}
```

**Example JSON**:
```json
{
  "id": "university-masters",
  "title": "Master of Computer Science",
  "subTitle": "Software Engineering",
  "startDate": "2018-09-01",
  "endDate": "2020-06-30",
  "description": "Advanced studies in computer science with focus on software engineering",
  "specialization": "Web Technologies",
  "relevantCourses": [
    "Advanced Web Development",
    "Software Architecture",
    "Database Systems"
  ],
  "institution": {
    "name": "University of Brussels",
    "logo": "assets/logos/university.png",
    "website": "https://www.university.be"
  },
  "order": 1
}
```

### ContactFormData Interface

```typescript
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  telNr?: string;             // Optional phone number
  allowedToCall?: boolean;    // Phone call permission
}
```

**Validation Rules**:
- `name`: Required, minimum 2 characters
- `email`: Required, valid email format
- `subject`: Required, minimum 3 characters
- `message`: Required, minimum 10 characters
- `telNr`: Optional, Belgian phone format when provided
- `allowedToCall`: Boolean, affects phone number requirement

---

## 🔄 Legacy Data Models

The application also includes legacy data models for backward compatibility:

### Person Class

**Location**: `src/app/models/Person.ts`

Main person data model with methods for age calculation and coordinate resolution.

#### Properties
```typescript
class Person {
  firstName: string;
  lastName: string;
  function: string;
  aboutMe: string;
  dateOfBirth: Date;
  email: string;
  phoneNumber: string;
  city: string;
  country: string;
  linkedInUrl: URL;
  githubUrl: URL;
  skills: Skill[];
  educations: Education[];
  certificates: Certificate[];
  experiences: Experience[];
  languages: Language[];
  projects: Project[];
  interests: String[];
}
```

#### Methods

##### `getAge(): number`
Calculates current age based on date of birth.

**Returns**: Number representing age in years
**Logic**: Accounts for month and day to determine if birthday has passed this year

##### `getCoordinates(): [number, number]`
Resolves geographic coordinates for the person's city.

**Returns**: Tuple of [latitude, longitude]
**Dependencies**: Uses `country-cities` library
**Fallback**: Returns [0, 0] if city not found

##### `getTimeline(): Event[]`
Combines all timeline events (education, certificates, experiences).

**Returns**: Array of Event objects
**Sorting**: Events should be sorted by date in implementing code

---

## 🎯 Response Formats

### Success Responses

#### Data Service Responses
All data service methods return observables that emit the requested data directly.

```typescript
// PersonalInfo success
{
  firstName: "Wout",
  lastName: "Deleu",
  // ... other fields
}

// Array responses (interests, social media, etc.)
[
  {
    id: "item1",
    name: "Item Name",
    // ... other fields
  }
]
```

#### Email Service Response
```typescript
// EmailJS Success Response
{
  status: 200,
  text: "OK"
}
```

### Error Handling

#### Data Service Errors
- **File Not Found**: Observable emits error if JSON file is missing
- **Invalid JSON**: Observable emits error if file contains invalid JSON
- **Network Error**: Observable emits error if file cannot be loaded

#### Email Service Errors
```typescript
// EmailJS Error Response
{
  status: 400,
  text: "Bad Request",
  // Additional error details
}
```

**Common Error Scenarios**:
- Invalid EmailJS configuration
- Network connectivity issues
- Rate limiting from EmailJS service
- Invalid template parameters

---

## 🔧 Content File Management

### File Naming Convention
- All content files use lowercase with hyphens
- Files are organized by category in subdirectories
- Each item has its own JSON file named by ID

### Directory Structure
```
assets/data/
├── personal/
│   └── info.json
├── interests/
│   ├── technology.json
│   ├── sports.json
│   └── gaming.json
├── social-media/
│   ├── github.json
│   └── linkedin.json
├── certifications/
│   ├── spring.json
│   ├── scrum.json
│   └── oracle.json
└── education/
    ├── university-xyz.json
    └── axxes.json
```

### Static File Lists
Since Angular cannot dynamically discover files, the DataService maintains static lists of known files:

```typescript
// Interest files
const interestFiles = ['badminton', 'gaming', 'sports', 'technology'];

// Social media files
const socialMediaFiles = ['github', 'linkedin'];

// Certification files
const certificationFiles = ['spring', 'scrum', 'oracle'];

// Education files
const educationFiles = ['university-xyz', 'axxes'];
```

**Adding New Content**:
1. Create new JSON file in appropriate directory
2. Add filename to corresponding array in DataService
3. Content will be automatically loaded and sorted by order field

---

## 📝 Usage Examples

### Loading All Data
```typescript
import { DataService } from './services/data.service';

constructor(private dataService: DataService) {}

ngOnInit() {
  // Load all data types
  forkJoin({
    personal: this.dataService.getPersonalInfo(),
    interests: this.dataService.getInterests(),
    socialMedia: this.dataService.getSocialMedia(),
    certifications: this.dataService.getCertifications(),
    education: this.dataService.getEducation()
  }).subscribe(data => {
    this.personalInfo = data.personal;
    this.interests = data.interests;
    this.socialMedia = data.socialMedia;
    this.certifications = data.certifications;
    this.education = data.education;
  });
}
```

### Sending Contact Form
```typescript
import { EmailService, ContactFormData } from './services/email.service';

constructor(private emailService: EmailService) {}

async submitForm(formData: ContactFormData) {
  try {
    const result = await this.emailService.sendEmail(formData);
    console.log('Email sent successfully:', result.text);

    // Show success message
    this.showSuccessMessage();
  } catch (error) {
    console.error('Failed to send email:', error);

    // Show error message
    this.showErrorMessage();
  }
}
```

### Working with Legacy Person Model
```typescript
import { Person } from './models/Person';
import { PersonJSON } from './models/data/PersonJSON';

// Load person data
const personData = require('./assets/data/JohnDoe.json') as PersonJSON;
const person = new Person(personData);

// Use person methods
console.log('Age:', person.getAge());
console.log('Coordinates:', person.getCoordinates());
console.log('Timeline:', person.getTimeline());
```

---

## 🔐 Security Considerations

### Email Configuration
- EmailJS public key is safe to expose in client-side code
- Service ID and Template ID should be treated as semi-sensitive
- Never expose EmailJS private key in client-side code

### Data Validation
- All form inputs are validated on both client and template level
- Phone numbers are formatted but not stored server-side
- Email addresses are validated using Angular's built-in validators

### Content Security
- All content files are static JSON served from assets
- No user-generated content is stored or processed
- SVG icons should be sanitized before use in DOM

---

*Last updated: September 2025*