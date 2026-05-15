import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, switchMap, map, of, catchError } from 'rxjs';
import { SafeHtml } from '@angular/platform-browser';

export interface SocialMedia {
  id: string;
  name: string;
  url: string;
  icon: string | SafeHtml;
  color: string;
  order: number;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  birthDate: string;
  title: string;
  description: string;
  extendedBio?: string[];
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

export interface Interest {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  order: number;
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  logo?: string;
  logoImage?: string;
  credentialUrl: string;
  achieved: string;
  expires: string;
  description: string;
  tags?: string[];
  startDate: string;
  type: string;
  order: number;
}

export interface Education {
  id: string;
  title: string;
  subTitle: string;
  startDate: string;
  endDate: string;
  description: string;
  specialization: string;
  relevantCourses: string[];
  institution: {
    name: string;
    logo: string;
    website: string;
  };
  order: number;
}

export interface Skill {
  id: string;
  name: string;
  proficiency: number;
  icon: string;
  color: string;
  order: number;
}

export interface Language {
  id: string;
  name: string;
  level: string;
  flag: string;
  order: number;
}

export interface TimelineItemData {
  id: string;
  title?: string;
  organization?: string;
  startDate: string;
  endDate?: string | null;
  type: 'period' | 'event';
  icon?: string;
  logoImage?: string;
  shortDescription?: string;
  details?: string;
  tags?: string[];
  location?: string;
  certificationId?: string;
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly basePath = 'assets/data';

  constructor(private http: HttpClient) { }

  getPersonalInfo(): Observable<PersonalInfo> {
    return this.http.get<PersonalInfo>(`${this.basePath}/personal/info.json`);
  }

  getInterests(): Observable<Interest[]> {
    return this.http.get<{ interests: string[] }>(`${this.basePath}/interests/index.json`).pipe(
      switchMap(({ interests }) =>
        interests.length ? forkJoin(interests.map(id =>
          this.http.get<Interest>(`${this.basePath}/interests/${id}.json`)
        )) : of([])
      ),
      map(items => items.sort((a, b) => a.order - b.order))
    );
  }

  getSocialMedia(): Observable<SocialMedia[]> {
    return this.http.get<{ socialMedia: string[] }>(`${this.basePath}/social-media/index.json`).pipe(
      switchMap(({ socialMedia }) =>
        socialMedia.length ? forkJoin(socialMedia.map(id =>
          this.http.get<SocialMedia>(`${this.basePath}/social-media/${id}.json`)
        )) : of([])
      ),
      map(items => items.sort((a, b) => a.order - b.order))
    );
  }

  getCertifications(): Observable<Certification[]> {
    return this.http.get<{ certifications: string[] }>(`${this.basePath}/certifications/index.json`).pipe(
      switchMap(({ certifications }) =>
        certifications.length ? forkJoin(certifications.map(id =>
          this.http.get<Certification>(`${this.basePath}/certifications/${id}.json`)
        )) : of([])
      ),
      map(items => items.sort((a, b) => a.order - b.order))
    );
  }

  getEducation(): Observable<Education[]> {
    return this.http.get<{ education: string[] }>(`${this.basePath}/education/index.json`).pipe(
      switchMap(({ education }) =>
        education.length ? forkJoin(education.map(id =>
          this.http.get<Education>(`${this.basePath}/education/${id}.json`)
        )) : of([])
      ),
      map(items => items.sort((a, b) => a.order - b.order))
    );
  }

  getSkills(): Observable<Skill[]> {
    return this.http.get<{ skills: string[] }>(`${this.basePath}/skills/index.json`).pipe(
      switchMap(({ skills }) =>
        skills.length ? forkJoin(skills.map(id =>
          this.http.get<Skill>(`${this.basePath}/skills/${id}.json`)
        )) : of([])
      ),
      map(items => items.sort((a, b) => a.order - b.order))
    );
  }

  getLanguages(): Observable<Language[]> {
    return this.http.get<{ languages: string[] }>(`${this.basePath}/languages/index.json`).pipe(
      switchMap(({ languages }) =>
        languages.length ? forkJoin(languages.map(id =>
          this.http.get<Language>(`${this.basePath}/languages/${id}.json`)
        )) : of([])
      ),
      map(items => items.sort((a, b) => a.order - b.order))
    );
  }

  getCareerTimeline(): Observable<TimelineItemData[]> {
    return this.http.get<{ career: string[] }>(`${this.basePath}/career/index.json`).pipe(
      switchMap(({ career }) =>
        career.length ? forkJoin(career.map(id =>
          this.http.get<TimelineItemData>(`${this.basePath}/career/${id}.json`)
        )) : of([])
      ),
      map(items => items.sort((a, b) => a.order - b.order)),
      catchError(() => of([]))
    );
  }

  getTimelineEducation(): Observable<TimelineItemData[]> {
    return this.http.get<{ 'timeline-education': string[] }>(`${this.basePath}/timeline-education/index.json`).pipe(
      switchMap(index => {
        const ids = index['timeline-education'];
        return ids.length ? forkJoin(ids.map(id =>
          this.http.get<TimelineItemData>(`${this.basePath}/timeline-education/${id}.json`)
        )) : of([]);
      }),
      map(items => items.sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateB - dateA;
      })),
      catchError(() => of([]))
    );
  }

  getProjectsTimeline(): Observable<TimelineItemData[]> {
    return this.http.get<{ projects: string[] }>(`${this.basePath}/projects/index.json`).pipe(
      switchMap(({ projects }) =>
        projects.length ? forkJoin(projects.map(id =>
          this.http.get<TimelineItemData>(`${this.basePath}/projects/${id}.json`)
        )) : of([])
      ),
      map(items => items.sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateB - dateA;
      })),
      catchError(() => of([]))
    );
  }
}
