import { Component, HostListener, AfterViewInit } from '@angular/core';

interface Skill {
  name: string;
  proficiency: number;
  icon: string;
  color: string;
}

interface Language {
  name: string;
  level: string;
  flag: string;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  standalone: false
})
export class PortfolioComponent implements AfterViewInit {
  activeSection: string = 'about';
  skills: Skill[] = [
    {
      name: 'Python',
      proficiency: 80,
      icon: `<svg viewBox="0 0 256 255" width="48" height="48"><defs><linearGradient x1="12.959%" y1="12.039%" x2="79.639%" y2="78.201%" id="a"><stop stop-color="#387EB8" offset="0%"/><stop stop-color="#366994" offset="100%"/></linearGradient><linearGradient x1="19.128%" y1="20.579%" x2="90.742%" y2="88.429%" id="b"><stop stop-color="#FFE052" offset="0%"/><stop stop-color="#FFC331" offset="100%"/></linearGradient></defs><path d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z" fill="url(#a)"/><path d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.519 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z" fill="url(#b)"/></svg>`,
      color: '#3776ab'
    },
    {
      name: 'Java',
      proficiency: 70,
      icon: `<svg viewBox="0 0 256 346" width="48" height="48"><path d="M82.554 267.473s-13.198 7.675 9.393 10.272c27.369 3.122 41.356 2.675 71.517-3.034 0 0 7.93 4.972 19.003 9.279-67.611 28.977-153.019-1.679-99.913-16.517" fill="#5382A1"/><path d="M74.292 230.46s-14.803 10.958 7.805 13.296c29.236 3.016 52.324 3.263 92.276-4.43 0 0 5.526 5.602 14.215 8.666-81.747 23.904-172.798 1.885-114.296-17.532" fill="#5382A1"/><path d="M143.942 165.515c16.66 19.18-4.377 36.44-4.377 36.44s42.301-21.837 22.874-49.183c-18.144-25.5-32.059-38.172 43.268-81.858 0 0-118.238 29.53-61.765 94.6" fill="#E76F00"/><path d="M233.364 295.442s9.767 8.047-10.757 14.273c-39.026 11.823-162.432 15.393-196.714.471-12.323-5.36 10.787-12.8 18.056-14.362 7.581-1.644 11.914-1.337 11.914-1.337-13.705-9.655-88.583 18.957-38.034 27.15 137.853 22.356 251.292-10.066 215.535-26.195" fill="#5382A1"/><path d="M88.9 190.48s-62.771 14.91-22.228 20.323c17.118 2.292 51.243 1.774 83.030-.89 25.978-2.19 52.063-6.85 52.063-6.85s-9.16 3.923-15.787 8.448c-63.744 16.765-186.886 8.966-151.435-8.183 29.981-14.492 54.358-12.848 54.358-12.848" fill="#5382A1"/><path d="M201.506 253.422c64.8-33.672 34.839-66.03 13.927-61.67-5.126 1.066-7.411 1.99-7.411 1.99s1.903-2.98 5.537-4.27c41.37-14.545 73.187 42.897-13.355 65.647 0 .001 1.003-.895 1.302-1.697" fill="#5382A1"/><path d="M162.439.371s35.887 35.9-34.037 91.101c-56.071 44.282-12.786 69.53-.023 98.377-32.73-29.53-56.75-55.526-40.635-79.72C111.395 74.612 176.918 57.393 162.439.37" fill="#E76F00"/><path d="M95.268 344.665c62.199 3.982 157.712-2.209 159.974-31.64 0 0-4.348 11.158-51.404 20.018-53.088 9.99-118.564 8.824-157.399 2.421.001 0 7.95 6.58 48.829 9.201" fill="#5382A1"/></svg>`,
      color: '#f89820'
    },
    {
      name: 'C++',
      proficiency: 60,
      icon: `<svg viewBox="0 0 256 288" width="48" height="48"><path d="M255.569 84.452c-.002-4.83-1.035-9.098-3.124-12.761-2.052-3.602-5.125-6.621-9.247-9.008L134.758 1.304c-8.208-4.738-18.306-4.738-26.508 0L.009 62.683C-8.17 67.408-12.258 76.005-12.258 84.452l-.001 119.464c0 8.45 4.084 17.048 12.259 21.775l108.24 61.379c8.206 4.735 18.304 4.735 26.508 0l108.241-61.379c8.166-4.724 12.25-13.322 12.25-21.775V84.452z" fill="#044F88"/><path d="M122.034 84.452c-9.532-9.532-24.972-9.532-34.504 0s-9.532 24.972 0 34.504 24.972 9.532 34.504 0 9.532-24.972 0-34.504" fill="#00549D"/><path d="M122.034 144.462c-9.532-9.532-24.972-9.532-34.504 0s-9.532 24.972 0 34.504 24.972 9.532 34.504 0 9.532-24.972 0-34.504" fill="#00549D"/><path d="M166.533 108.456c-9.532-9.532-24.972-9.532-34.504 0s-9.532 24.972 0 34.504 24.972 9.532 34.504 0 9.532-24.972 0-34.504" fill="#00549D"/><path d="M211.033 84.452c-9.532-9.532-24.972-9.532-34.504 0s-9.532 24.972 0 34.504 24.972 9.532 34.504 0 9.532-24.972 0-34.504" fill="#00549D"/><path d="M211.033 144.462c-9.532-9.532-24.972-9.532-34.504 0s-9.532 24.972 0 34.504 24.972 9.532 34.504 0 9.532-24.972 0-34.504" fill="#00549D"/><path d="M166.533 108.456h11.5v11.5h-11.5z" fill="#fff"/><path d="M166.533 130.458h11.5v11.5h-11.5z" fill="#fff"/><path d="M155.033 119.956h11.5v11.5h-11.5z" fill="#fff"/><path d="M178.033 119.956h11.5v11.5h-11.5z" fill="#fff"/><path d="M211.033 84.452h11.5v11.5h-11.5z" fill="#fff"/><path d="M211.033 106.454h11.5v11.5h-11.5z" fill="#fff"/><path d="M199.533 94.952h11.5v11.5h-11.5z" fill="#fff"/><path d="M222.533 94.952h11.5v11.5h-11.5z" fill="#fff"/><path d="M211.033 144.462h11.5v11.5h-11.5z" fill="#fff"/><path d="M211.033 166.464h11.5v11.5h-11.5z" fill="#fff"/><path d="M199.533 154.962h11.5v11.5h-11.5z" fill="#fff"/><path d="M222.533 154.962h11.5v11.5h-11.5z" fill="#fff"/></svg>`,
      color: '#00599C'
    },
    {
      name: 'Angular',
      proficiency: 50,
      icon: `<svg viewBox="0 0 256 272" width="48" height="48"><g><path d="M.1 45.522L125.908.697l129.196 44.028-20.919 166.45-108.277 59.966-106.583-59.169L.1 45.522z" fill="#E23237"/><path d="M255.104 44.725L125.908.697v270.444l108.277-59.866 20.919-166.55z" fill="#B52E31"/><path d="M126.107 32.274L47.714 206.693l29.285-.498 15.739-39.347h70.325l17.233 39.845 27.99.498-82.179-174.917zm.2 55.882l26.496 55.383h-49.806l23.31-55.383z" fill="#FFF"/></g></svg>`,
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
    const sections = ['about', 'skills', 'certifications', 'interests', 'contact'];
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
