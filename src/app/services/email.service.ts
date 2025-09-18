import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

export interface EmailConfig {
  recipientEmail: string;
  emailService: {
    provider: string;
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  telNr?: string;
  allowedToCall?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private emailConfig: EmailConfig | null = null;
  private configLoaded = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadEmailConfig();
  }

  private async loadEmailConfig(): Promise<void> {
    try {
      const config = await this.http.get<EmailConfig>('assets/config/email-config.json').toPromise();
      this.emailConfig = config || null;
      this.configLoaded.next(true);
    } catch (error) {
      console.error('Failed to load email configuration:', error);
      // Fallback configuration
      this.emailConfig = {
        recipientEmail: 'wout.deleu@gmail.com',
        emailService: {
          provider: 'emailjs',
          serviceId: 'service_x85363u',
          templateId: 'template_08pbt9i',
          publicKey: 'tAL5L8Z5FRoC9hh2k'
        }
      };
      this.configLoaded.next(true);
    }
  }

  getConfigLoaded(): Observable<boolean> {
    return this.configLoaded.asObservable();
  }

  getRecipientEmail(): string {
    return this.emailConfig?.recipientEmail || 'wout.deleu@gmail.com';
  }

  async sendEmail(formData: ContactFormData): Promise<EmailJSResponseStatus> {
    if (!this.emailConfig) {
      throw new Error('Email configuration not loaded');
    }

    const templateParams = {
      to_email: this.emailConfig.recipientEmail,
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      phone: formData.telNr || 'Not provided',
      can_call: formData.allowedToCall ? 'Yes' : 'No',
      reply_to: formData.email
    };

    return emailjs.send(
      this.emailConfig.emailService.serviceId,
      this.emailConfig.emailService.templateId,
      templateParams,
      this.emailConfig.emailService.publicKey
    );
  }

  async sendEmailFromForm(formElement: HTMLFormElement): Promise<EmailJSResponseStatus> {
    if (!this.emailConfig) {
      throw new Error('Email configuration not loaded');
    }

    return emailjs.sendForm(
      this.emailConfig.emailService.serviceId,
      this.emailConfig.emailService.templateId,
      formElement,
      this.emailConfig.emailService.publicKey
    );
  }
}