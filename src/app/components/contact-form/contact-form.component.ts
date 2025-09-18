import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { EmailJSResponseStatus } from '@emailjs/browser';
import {takeUntil, tap, Subject} from "rxjs";
import { EmailService, ContactFormData } from '../../services/email.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.scss'],
    standalone: false,
    animations: [
      trigger('slideInOut', [
        transition(':enter', [
          style({
            opacity: 0,
            transform: 'translateY(-10px)',
            height: '0px',
            overflow: 'hidden'
          }),
          animate('400ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({
              opacity: 1,
              transform: 'translateY(0)',
              height: '*'
            })
          )
        ]),
        transition(':leave', [
          animate('300ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({
              opacity: 0,
              transform: 'translateY(-10px)',
              height: '0px'
            })
          )
        ])
      ])
    ]
})
export class ContactFormComponent implements OnInit, OnDestroy {
  form: FormGroup;
  allowedToCall: boolean;
  isSubmitting: boolean = false;
  submitStatus: 'idle' | 'success' | 'error' = 'idle';
  statusMessage: string = '';
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(
    private formBuilder: FormBuilder,
    public emailService: EmailService
  ) {
    this.allowedToCall = false;
  }

  toggle_disable_telnr() {
    this.allowedToCall = this.form.get('allowedToCall')?.value;

    // Clear phone number when checkbox is unchecked
    if (!this.allowedToCall) {
      this.form.get('telNr')?.setValue(null);
      this.form.get('countryCode')?.setValue('+32'); // Reset to default
    }
  }

  async send(e: Event): Promise<void> {
    e.preventDefault();

    if (this.form.invalid || this.isSubmitting) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitStatus = 'idle';
    this.statusMessage = '';

    try {
      const formData: ContactFormData = {
        name: this.form.get('name')?.value,
        email: this.form.get('email')?.value,
        subject: this.form.get('subject')?.value,
        message: this.form.get('message')?.value,
        telNr: this.form.get('allowedToCall')?.value
          ? `${this.form.get('countryCode')?.value} ${this.form.get('telNr')?.value}`
          : undefined,
        allowedToCall: this.form.get('allowedToCall')?.value
      };

      const result = await this.emailService.sendEmail(formData);
      console.log('Email sent successfully:', result.text);

      this.submitStatus = 'success';
      this.statusMessage = `Email sent successfully to ${this.emailService.getRecipientEmail()}!`;
      this.form.reset();
      this.allowedToCall = false;

      // Reset status after 5 seconds
      setTimeout(() => {
        this.submitStatus = 'idle';
        this.statusMessage = '';
      }, 5000);

    } catch (error: any) {
      console.error('Failed to send email:', error);
      this.submitStatus = 'error';
      this.statusMessage = 'Failed to send email. Please try again later.';

      // Reset status after 5 seconds
      setTimeout(() => {
        this.submitStatus = 'idle';
        this.statusMessage = '';
      }, 5000);
    } finally {
      this.isSubmitting = false;
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
    });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control(null, [Validators.required, Validators.minLength(2)]),
      email: this.formBuilder.control(null, [Validators.required, Validators.email]),
      subject: this.formBuilder.control(null, [Validators.required, Validators.minLength(3)]),
      message: this.formBuilder.control(null, [Validators.required, Validators.minLength(10)]),

      allowedToCall: new FormControl(false),
      countryCode: new FormControl('+32'), // Default to Belgium
      telNr: this.formBuilder.control(null),
    });
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  onPhoneNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\s/g, ''); // Remove existing spaces
    const formattedValue = this.formatPhoneNumber(value);

    // Update the form control with the formatted value
    this.form.get('telNr')?.setValue(formattedValue, { emitEvent: false });

    // Update the input field directly to maintain cursor position
    input.value = formattedValue;
  }

  private formatPhoneNumber(phoneNumber: string): string {
    // Remove all non-digit characters
    const digits = phoneNumber.replace(/\D/g, '');

    // Handle Belgian mobile formats: 0470 or 470
    if (digits.length === 0) {
      return '';
    }

    // Check if it starts with 0 (full Belgian format) or not (short format)
    const startsWithZero = digits.startsWith('0');

    if (startsWithZero) {
      // Format: 0XXX XX XX XX (e.g., 0470 12 34 56)
      if (digits.length <= 4) {
        return digits;
      } else if (digits.length <= 6) {
        return `${digits.slice(0, 4)} ${digits.slice(4)}`;
      } else if (digits.length <= 8) {
        return `${digits.slice(0, 4)} ${digits.slice(4, 6)} ${digits.slice(6)}`;
      } else {
        return `${digits.slice(0, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`;
      }
    } else {
      // Format: XXX XX XX XX (e.g., 470 12 34 56)
      if (digits.length <= 3) {
        return digits;
      } else if (digits.length <= 5) {
        return `${digits.slice(0, 3)} ${digits.slice(3)}`;
      } else if (digits.length <= 7) {
        return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`;
      } else {
        return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
      }
    }
  }
}