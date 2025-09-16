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

export interface InterestIndex {
  interests: string[];
}

export interface SocialMediaIndex {
  socialMedia: string[];
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
    return this.http.get<InterestIndex>(`${this.basePath}/interests/index.json`).pipe(
      switchMap(index => {
        const interestRequests = index.interests.map(id =>
          this.http.get<Interest>(`${this.basePath}/interests/${id}.json`)
        );
        return forkJoin(interestRequests);
      }),
      map(interests => interests.sort((a, b) => a.order - b.order))
    );
  }

  getSocialMedia(): Observable<SocialMedia[]> {
    return this.http.get<SocialMediaIndex>(`${this.basePath}/social-media/index.json`).pipe(
      switchMap(index => {
        const socialMediaRequests = index.socialMedia.map(id =>
          this.http.get<SocialMedia>(`${this.basePath}/social-media/${id}.json`)
        );
        return forkJoin(socialMediaRequests);
      }),
      map(socialMedia => socialMedia.sort((a, b) => a.order - b.order))
    );
  }
}
