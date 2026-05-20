import { Component, HostListener, AfterViewInit, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { DataService, PersonalInfo, TimelineItemData } from '../../services/data.service';

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
  logoImage?: string;
  shortDescription: string;
  details: string;
  tags?: string[];
  location?: string;
  image?: string;
  certificationId?: string;
}

interface Timeline {
  title: string;
  items: TimelineItem[];
}

interface Interest {
  name: string;
  description: string;
  extendedDescription?: string;
  icon: SafeHtml;
  color: string;
}

interface Certification {
  id: string;
  title: string;
  organization: string;
  logo?: SafeHtml;
  logoImage?: string;
  credentialUrl: string;
  achieved: string;
  expires: string;
  description: string;
  tags?: string[];
  startDate: Date;
  type: string;
  order: number;
}

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  standalone: false
})
export class PortfolioComponent implements AfterViewInit, OnInit {
  activeSection: string = 'about';
  isMobileMenuOpen: boolean = false;

  // Data from external files
  personalInfo: PersonalInfo | null = null;
  socialMediaLinks: any[] = [];
  birthDate: Date = new Date('1995-08-15'); // Fallback
  age: number;
  showAge: boolean = true;
  expandedItemId: string | null = null;
  showIntroModal: boolean = false;
  selectedInterest: Interest | null = null;

  constructor(
    private sanitizer: DomSanitizer,
    private dataService: DataService
  ) {
    this.age = this.calculateAge();
  }

  ngOnInit(): void {
    this.loadPersonalInfo();
    this.loadInterests();
    this.loadSocialMedia();
    this.loadCertifications();
    this.loadSkills();
    this.loadLanguages();
    this.loadTimelines();
  }

  private loadPersonalInfo(): void {
    this.dataService.getPersonalInfo().subscribe({
      next: (data) => {
        this.personalInfo = data;
        this.birthDate = new Date(data.birthDate);
        this.age = this.calculateAge();
      },
      error: (error) => {
        console.error('Error loading personal info:', error);
      }
    });
  }

  private loadInterests(): void {
    this.dataService.getInterests().subscribe({
      next: (data) => {
        this.interests = data.map(interest => ({
          name: interest.name,
          description: interest.description,
          extendedDescription: interest.extendedDescription,
          icon: this.sanitizer.bypassSecurityTrustHtml(interest.icon),
          color: interest.color
        }));
      },
      error: (error) => {
        console.error('Error loading interests:', error);
      }
    });
  }

  private loadSocialMedia(): void {
    this.dataService.getSocialMedia().subscribe({
      next: (data) => {
        this.socialMediaLinks = data.map(social => ({
          ...social,
          icon: this.sanitizer.bypassSecurityTrustHtml(social.icon as string)
        }));
      },
      error: (error) => {
        console.error('Error loading social media:', error);
      }
    });
  }

  private loadSkills(): void {
    this.dataService.getSkills().subscribe({
      next: (data) => {
        this.skills = data.map(skill => ({
          name: skill.name,
          proficiency: skill.proficiency,
          icon: this.sanitizer.bypassSecurityTrustHtml(skill.icon),
          color: skill.color
        }));
      },
      error: (error) => {
        console.error('Error loading skills:', error);
      }
    });
  }

  private loadLanguages(): void {
    this.dataService.getLanguages().subscribe({
      next: (data) => {
        this.languageList = data.map(lang => ({
          name: lang.name,
          level: lang.level,
          flag: lang.flag
        }));
      },
      error: (error) => {
        console.error('Error loading languages:', error);
      }
    });
  }

  private loadTimelines(): void {
    forkJoin({
      career: this.dataService.getCareerTimeline(),
      education: this.dataService.getTimelineEducation(),
      projects: this.dataService.getProjectsTimeline()
    }).subscribe({
      next: ({ career, education, projects }) => {
        this.timelines[0].items = career.map(item => this.timelineDataToItem(item));
        this.timelines[1].items = education.map(item => this.timelineDataToItem(item));
        this.timelines[2].items = projects.map(item => this.timelineDataToItem(item));
      },
      error: (error) => {
        console.error('Error loading timelines:', error);
      }
    });
  }

  private timelineDataToItem(data: TimelineItemData): TimelineItem {
    return {
      id: data.id,
      title: data.title || '',
      organization: data.organization,
      startDate: new Date(data.startDate),
      endDate: data.endDate ? new Date(data.endDate) : undefined,
      type: data.type,
      icon: this.sanitizer.bypassSecurityTrustHtml(data.icon || ''),
      logoImage: data.logoImage,
      shortDescription: data.shortDescription || '',
      details: data.details || '',
      tags: data.tags,
      location: data.location,
      certificationId: data.certificationId
    };
  }

  private loadCertifications(): void {
    this.dataService.getCertifications().subscribe({
      next: (data) => {
        this.certifications = data.map(cert => ({
          ...cert,
          startDate: new Date(cert.startDate),
          logo: cert.logo ? this.sanitizer.bypassSecurityTrustHtml(cert.logo) : undefined
        }));
      },
      error: (error) => {
        console.error('Error loading certifications:', error);
      }
    });
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
    this.expandedItemId = this.expandedItemId === item.id ? null : item.id;
  }

  openIntroModal(): void {
    this.showIntroModal = true;
  }

  closeIntroModal(): void {
    this.showIntroModal = false;
  }

  openInterestModal(interest: Interest): void {
    if (interest.extendedDescription) {
      this.selectedInterest = interest;
    }
  }

  closeInterestModal(): void {
    this.selectedInterest = null;
  }

  getInterestParagraphs(interest: Interest): string[] {
    return interest.extendedDescription?.split('\n\n') ?? [];
  }

  skills: Skill[] = [];


  languageList: Language[] = [];

  interests: Interest[] = []; // Loaded from external files
  certifications: Certification[] = []; // Loaded from external files

  timelines: Timeline[] = [
    { title: 'Professional Career', items: [] },
    { title: 'Education & Certificates', items: [] },
    { title: 'Projects', items: [] }
  ];

  ngAfterViewInit(): void {
    this.updateActiveSection();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    this.updateActiveSection();
  }

  onMainContentScroll(event: Event): void {
    // No-op: scrolling is now handled by the window
  }

  scrollToSection(sectionId: string): void {
    this.activeSection = sectionId;
    this.isMobileMenuOpen = false;

    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        const headerHeight = 70;
        const elementTop = element.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: elementTop, behavior: 'smooth' });
      }
    }, 100);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  scrollToTop(): void {
    this.activeSection = 'about';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }


  isActiveSection(sectionId: string): boolean {
    return this.activeSection === sectionId;
  }

  updateActiveSection(): void {
    const sections = ['about', 'skills', 'timeline', 'certifications', 'interests', 'contact'];
    const headerHeight = 70;
    const scrollTop = window.scrollY + headerHeight + 100;

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = document.getElementById(sections[i]);
      if (section) {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        if (scrollTop >= sectionTop) {
          this.activeSection = sections[i];
          break;
        }
      }
    }
  }

  getSocialMediaLinks() {
    return this.socialMediaLinks || [];
  }

  getCertificationById(id: string): Certification | undefined {
    return this.certifications.find(cert => cert.id === id);
  }

  encodeURIComponent(str: string): string {
    return encodeURIComponent(str);
  }
}
