import { Component, HostListener, AfterViewInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface Skill {
  name: string;
  proficiency: number;
  icon: SafeHtml;
  color: string;
}

interface Language {
  name: string;
  level: string;
  flag: string;
}

interface TimelineItem {
  id: string;
  title: string;
  organization?: string;
  startDate: Date;
  endDate?: Date;
  type: 'period' | 'event';
  icon: SafeHtml;
  shortDescription: string;
  details: string;
  tags?: string[];
  location?: string;
  image?: string;
}

interface Timeline {
  title: string;
  items: TimelineItem[];
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  standalone: false
})
export class PortfolioComponent implements AfterViewInit {
  activeSection: string = 'about';
  birthDate: Date = new Date('1995-08-15'); // Update with your actual birthdate
  age: number;
  showAge: boolean = true;
  selectedTimelineItem: TimelineItem | null = null;

  constructor(private sanitizer: DomSanitizer) {
    this.age = this.calculateAge();
  }

  private calculateAge(): number {
    const today = new Date();
    const birthDate = this.birthDate;
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  toggleAgeDisplay(): void {
    this.showAge = !this.showAge;
  }

  getFormattedBirthDate(): string {
    return this.birthDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTimelineDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  }

  getTimelineDuration(item: TimelineItem): string {
    if (item.type === 'event') {
      return this.formatTimelineDate(item.startDate);
    }

    const start = this.formatTimelineDate(item.startDate);
    const end = item.endDate ? this.formatTimelineDate(item.endDate) : 'Present';
    return `${start} - ${end}`;
  }

  onTimelineItemClick(item: TimelineItem): void {
    this.selectedTimelineItem = item;
  }

  onTimelineItemHover(item: TimelineItem): void {
    // Hover effects will be handled by CSS
  }

  closeTimelineDetail(): void {
    this.selectedTimelineItem = null;
  }

  skills: Skill[] = [
    {
      name: 'Python',
      proficiency: 80,
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 256 255" width="36" height="36"><defs><linearGradient x1="12.959%" y1="12.039%" x2="79.639%" y2="78.201%" id="python-a"><stop stop-color="#387EB8" offset="0%"/><stop stop-color="#366994" offset="100%"/></linearGradient><linearGradient x1="19.128%" y1="20.579%" x2="90.742%" y2="88.429%" id="python-b"><stop stop-color="#FFE052" offset="0%"/><stop stop-color="#FFC331" offset="100%"/></linearGradient></defs><path d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" fill="url(#python-a)"/><path d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.519 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" fill="url(#python-b)"/></svg>`),
      color: '#3776ab'
    },
    {
      name: 'Java',
      proficiency: 70,
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 256 346" width="36" height="36"><path d="M82.554 267.473s-13.198 7.675 9.393 10.272c27.369 3.122 41.356 2.675 71.517-3.034 0 0 7.93 4.972 19.003 9.279-67.611 28.977-153.019-1.679-99.913-16.517" fill="#5382A1"/><path d="M74.292 230.46s-14.803 10.958 7.805 13.296c29.236 3.016 52.324 3.263 92.276-4.43 0 0 5.526 5.602 14.215 8.666-81.747 23.904-172.798 1.885-114.296-17.532" fill="#5382A1"/><path d="M143.942 165.515c16.66 19.18-4.377 36.44-4.377 36.44s42.301-21.837 22.874-49.183c-18.144-25.5-32.059-38.172 43.268-81.858 0 0-118.238 29.53-61.765 94.6" fill="#E76F00"/><path d="M233.364 295.442s9.767 8.047-10.757 14.273c-39.026 11.823-162.432 15.393-196.714.471-12.323-5.36 10.787-12.8 18.056-14.362 7.581-1.644 11.914-1.337 11.914-1.337-13.705-9.655-88.583 18.957-38.034 27.15 137.853 22.356 251.292-10.066 215.535-26.195" fill="#5382A1"/><path d="M88.9 190.48s-62.771 14.91-22.228 20.323c17.118 2.292 51.243 1.774 83.030-.89 25.978-2.19 52.063-6.85 52.063-6.85s-9.16 3.923-15.787 8.448c-63.744 16.765-186.886 8.966-151.435-8.183 29.981-14.492 54.358-12.848 54.358-12.848" fill="#5382A1"/><path d="M201.506 253.422c64.8-33.672 34.839-66.03 13.927-61.67-5.126 1.066-7.411 1.99-7.411 1.99s1.903-2.98 5.537-4.27c41.37-14.545 73.187 42.897-13.355 65.647 0 .001 1.003-.895 1.302-1.697" fill="#5382A1"/><path d="M162.439.371s35.887 35.9-34.037 91.101c-56.071 44.282-12.786 69.53-.023 98.377-32.73-29.53-56.75-55.526-40.635-79.72C111.395 74.612 176.918 57.393 162.439.37" fill="#E76F00"/><path d="M95.268 344.665c62.199 3.982 157.712-2.209 159.974-31.64 0 0-4.348 11.158-51.404 20.018-53.088 9.99-118.564 8.824-157.399 2.421.001 0 7.95 6.58 48.829 9.201" fill="#5382A1"/></svg>`),
      color: '#f89820'
    },
    {
      name: 'C++',
      proficiency: 60,
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 256 288" width="36" height="36"><path d="M255.569 84.452c-.002-4.83-1.035-9.098-3.124-12.761-2.052-3.602-5.125-6.621-9.247-9.008L134.758 1.304c-8.208-4.738-18.306-4.738-26.508 0L.009 62.683C-8.17 67.408-12.258 76.005-12.258 84.452l-.001 119.464c0 8.45 4.084 17.048 12.259 21.775l108.24 61.379c8.206 4.735 18.304 4.735 26.508 0l108.241-61.379c8.166-4.724 12.25-13.322 12.25-21.775V84.452z" fill="#044F88"/><path d="M122.034 84.452c-9.532-9.532-24.972-9.532-34.504 0s-9.532 24.972 0 34.504 24.972 9.532 34.504 0 9.532-24.972 0-34.504" fill="#00549D"/><path d="M122.034 144.462c-9.532-9.532-24.972-9.532-34.504 0s-9.532 24.972 0 34.504 24.972 9.532 34.504 0 9.532-24.972 0-34.504" fill="#00549D"/><path d="M166.533 108.456c-9.532-9.532-24.972-9.532-34.504 0s-9.532 24.972 0 34.504 24.972 9.532 34.504 0 9.532-24.972 0-34.504" fill="#00549D"/><path d="M211.033 84.452c-9.532-9.532-24.972-9.532-34.504 0s-9.532 24.972 0 34.504 24.972 9.532 34.504 0 9.532-24.972 0-34.504" fill="#00549D"/><path d="M211.033 144.462c-9.532-9.532-24.972-9.532-34.504 0s-9.532 24.972 0 34.504 24.972 9.532 34.504 0 9.532-24.972 0-34.504" fill="#00549D"/><path d="M166.533 108.456h11.5v11.5h-11.5z" fill="#fff"/><path d="M166.533 130.458h11.5v11.5h-11.5z" fill="#fff"/><path d="M155.033 119.956h11.5v11.5h-11.5z" fill="#fff"/><path d="M178.033 119.956h11.5v11.5h-11.5z" fill="#fff"/><path d="M211.033 84.452h11.5v11.5h-11.5z" fill="#fff"/><path d="M211.033 106.454h11.5v11.5h-11.5z" fill="#fff"/><path d="M199.533 94.952h11.5v11.5h-11.5z" fill="#fff"/><path d="M222.533 94.952h11.5v11.5h-11.5z" fill="#fff"/><path d="M211.033 144.462h11.5v11.5h-11.5z" fill="#fff"/><path d="M211.033 166.464h11.5v11.5h-11.5z" fill="#fff"/><path d="M199.533 154.962h11.5v11.5h-11.5z" fill="#fff"/><path d="M222.533 154.962h11.5v11.5h-11.5z" fill="#fff"/></svg>`),
      color: '#00599C'
    },
    {
      name: 'Angular',
      proficiency: 50,
      icon: this.sanitizer.bypassSecurityTrustHtml(`<svg viewBox="0 0 256 272" width="36" height="36"><g><path d="M.1 45.522L125.908.697l129.196 44.028-20.919 166.45-108.277 59.966-106.583-59.169L.1 45.522z" fill="#E23237"/><path d="M255.104 44.725L125.908.697v270.444l108.277-59.866 20.919-166.55z" fill="#B52E31"/><path d="M126.107 32.274L47.714 206.693l29.285-.498 15.739-39.347h70.325l17.233 39.845 27.99.498-82.179-174.917zm.2 55.882l26.496 55.383h-49.806l23.31-55.383z" fill="#FFF"/></g></svg>`),
      color: '#dd0031'
    }
  ];

  certifications: string[] = [
    'PSM I',
    'OCP',
    'Industrial Engineering'
  ];

  languageList: Language[] = [
    { name: 'Dutch', level: 'Native', flag: '🇳🇱' },
    { name: 'English', level: 'Fluent', flag: '🇬🇧' },
    { name: 'French', level: 'Conversational', flag: '🇫🇷' }
  ];

  interests: string[] = [
    'Badminton',
    'Technology',
    'Sports'
  ];

  contactInfo: string[] = [
    'Email: wout.deleu@email.com',
    'Phone: +32 477 123 456',
    'LinkedIn: linkedin.com/in/woutdeleu'
  ];

  timelines: Timeline[] = [
    {
      title: 'Professional Career',
      items: [
        {
          id: 'job-3',
          title: 'Senior Backend Developer',
          organization: 'Tech Solutions Inc.',
          startDate: new Date('2023-01-15'),
          type: 'period',
          icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`),
          shortDescription: 'Leading backend development team, microservices architecture',
          details: 'Leading a team of 5 developers in designing and implementing microservices architecture. Responsible for system design, code reviews, and mentoring junior developers. Technologies: Python, Docker, Kubernetes, AWS.',
          tags: ['Python', 'Microservices', 'AWS', 'Team Lead'],
          location: 'Remote'
        },
        {
          id: 'job-2',
          title: 'Backend Developer',
          organization: 'StartupX',
          startDate: new Date('2021-06-01'),
          endDate: new Date('2022-12-31'),
          type: 'period',
          icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>`),
          shortDescription: 'Full-stack development, API design and implementation',
          details: 'Developed RESTful APIs and web applications using Python and React. Implemented CI/CD pipelines and worked closely with product team to deliver features.',
          tags: ['Python', 'React', 'API Development'],
          location: 'New York, NY'
        },
        {
          id: 'job-1',
          title: 'Junior Developer',
          organization: 'Digital Agency Co.',
          startDate: new Date('2020-09-01'),
          endDate: new Date('2021-05-31'),
          type: 'period',
          icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`),
          shortDescription: 'Web development, bug fixes, and feature implementation',
          details: 'Started my professional career developing websites and web applications. Learned best practices, worked with senior developers, and contributed to various client projects.',
          tags: ['HTML/CSS', 'JavaScript', 'PHP'],
          location: 'Brussels, Belgium'
        }
      ]
    },
    {
      title: 'Education & Certificates',
      items: [
        {
          id: 'cert-psm',
          title: 'Professional Scrum Master I',
          organization: 'Scrum.org',
          startDate: new Date('2022-11-15'),
          type: 'event',
          icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>`),
          shortDescription: 'Agile project management certification',
          details: 'Certified in Scrum framework and agile methodologies. Demonstrated understanding of Scrum theory, practices, and rules.',
          tags: ['Scrum', 'Agile', 'Project Management']
        },
        {
          id: 'cert-ocp',
          title: 'Oracle Certified Professional',
          organization: 'Oracle',
          startDate: new Date('2021-08-20'),
          type: 'event',
          icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><path d="M21 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/><path d="M3 12c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/><path d="M12 21c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/><path d="M12 3c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1z"/></svg>`),
          shortDescription: 'Java programming certification',
          details: 'Advanced Java programming certification covering OOP concepts, collections, concurrency, and best practices.',
          tags: ['Java', 'OOP', 'Certification']
        },
        {
          id: 'edu-engineering',
          title: 'Master in Industrial Engineering',
          organization: 'University of Technology',
          startDate: new Date('2017-09-01'),
          endDate: new Date('2020-06-30'),
          type: 'period',
          icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M6 12h16l-3-3m3 3l-3 3"/><path d="M22 10v6M6 12h16l-3-3m3 3l-3 3"/><path d="M2 10l10-8 10 8-10 2z"/><path d="M6 12v7a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-7"/></svg>`),
          shortDescription: 'Process optimization, project management, systems thinking',
          details: 'Comprehensive engineering program focusing on optimization, lean manufacturing, project management, and systems analysis. Thesis on process automation in manufacturing.',
          tags: ['Engineering', 'Process Optimization', 'Project Management'],
          location: 'Brussels, Belgium'
        }
      ]
    },
    {
      title: 'Projects',
      items: [
        {
          id: 'project-portfolio',
          title: 'Personal Portfolio Website',
          startDate: new Date('2024-09-01'),
          type: 'period',
          icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`),
          shortDescription: 'Modern Angular portfolio with interactive features',
          details: 'Built with Angular 20, featuring dark theme, smooth animations, progress circles, and responsive design. Includes timeline components and interactive elements.',
          tags: ['Angular', 'TypeScript', 'SCSS', 'Responsive Design'],
          location: 'Personal Project'
        },
        {
          id: 'project-ecommerce',
          title: 'E-commerce Platform',
          startDate: new Date('2023-03-01'),
          endDate: new Date('2023-08-15'),
          type: 'period',
          icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>`),
          shortDescription: 'Full-stack e-commerce solution with payment integration',
          details: 'Complete e-commerce platform with user authentication, product catalog, shopping cart, and Stripe payment integration. Built with Python Django backend and React frontend.',
          tags: ['Python', 'Django', 'React', 'Stripe', 'PostgreSQL'],
          location: 'Freelance Project'
        },
        {
          id: 'project-api',
          title: 'RESTful API Framework',
          startDate: new Date('2022-01-15'),
          endDate: new Date('2022-04-30'),
          type: 'period',
          icon: this.sanitizer.bypassSecurityTrustHtml(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>`),
          shortDescription: 'Scalable API framework with authentication and rate limiting',
          details: 'Built a reusable API framework with JWT authentication, rate limiting, caching, and comprehensive documentation. Used by multiple internal projects.',
          tags: ['Python', 'FastAPI', 'JWT', 'Redis', 'Docker'],
          location: 'Open Source'
        }
      ]
    }
  ];

  ngAfterViewInit(): void {
    this.updateActiveSection();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.updateActiveSection();
  }

  onMainContentScroll(event: Event): void {
    this.updateActiveSection();
  }

  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;
    const element = document.getElementById(sectionId);
    const mainContent = document.querySelector('.main-content') as HTMLElement;

    if (element && mainContent) {
      const headerHeight = 70; // Fixed header height
      const elementTop = element.offsetTop - mainContent.offsetTop - headerHeight;

      mainContent.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      });
    }
  }

  private updateActiveSection(): void {
    const sections = ['about', 'skills', 'certifications', 'interests', 'contact', 'timeline'];
    const mainContent = document.querySelector('.main-content') as HTMLElement;

    if (!mainContent) return;

    const scrollPosition = mainContent.scrollTop + 200; // Offset for header

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section) {
        const sectionTop = section.offsetTop - mainContent.offsetTop;
        if (sectionTop <= scrollPosition) {
          this.activeSection = sections[i];
          break;
        }
      }
    }
  }

  isActiveSection(sectionId: string): boolean {
    return this.activeSection === sectionId;
  }
}
