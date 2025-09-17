import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, switchMap, map } from 'rxjs';
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
    // List of known interest files - Angular can't dynamically discover files
    const interestFiles = ['badminton', 'gaming', 'sports', 'technology'];

    const interestRequests = interestFiles.map(id =>
      this.http.get<Interest>(`${this.basePath}/interests/${id}.json`)
    );

    return forkJoin(interestRequests).pipe(
      map(interests => interests.sort((a, b) => a.order - b.order))
    );
  }

  getSocialMedia(): Observable<SocialMedia[]> {
    // List of known social media files - Angular can't dynamically discover files
    const socialMediaFiles = ['github', 'linkedin'];

    const socialMediaRequests = socialMediaFiles.map(id =>
      this.http.get<SocialMedia>(`${this.basePath}/social-media/${id}.json`)
    );

    return forkJoin(socialMediaRequests).pipe(
      map(socialMedia => socialMedia.sort((a, b) => a.order - b.order))
    );
  }

  getCertifications(): Observable<Certification[]> {
    // List of known certification files - Angular can't dynamically discover files
    const certificationFiles = ['spring', 'scrum', 'oracle'];

    const certificationRequests = certificationFiles.map(id =>
      this.http.get<Certification>(`${this.basePath}/certifications/${id}.json`)
    );

    return forkJoin(certificationRequests).pipe(
      map(certifications => certifications.sort((a, b) => a.order - b.order))
    );
  }

  getEducation(): Observable<Education[]> {
    // List of known education files - Angular can't dynamically discover files
    const educationFiles = ['university-xyz', 'axxes'];

    const educationRequests = educationFiles.map(id =>
      this.http.get<Education>(`${this.basePath}/education/${id}.json`)
    );

    return forkJoin(educationRequests).pipe(
      map(education => education.sort((a, b) => a.order - b.order))
    );
  }
}
