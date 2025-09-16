import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser'
import {takeUntil, tap} from "rxjs";
@Component({
    selector: 'app-contact-form',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.scss'],
    standalone: false
})
export class ContactFormComponent implements OnInit {
  form: FormGroup;
  allowedToCall : boolean;

  ngOnInit(): void {
    this.buildForm();
  }

  constructor(private formBuilder: FormBuilder) {
    this.allowedToCall = true;
  }
  toggle_disable_telnr() {
    if(this.form.get('telNr')?.disabled) {
      this.form.get('telNr')?.enable();
      this.allowedToCall = true;
    }
    else {
      this.form.get('telNr')?.disable();
      this.allowedToCall = false;
    }
  }

  send(e : Event): void {
    e.preventDefault();
    emailjs.sendForm('service_x85363u', 'template_08pbt9i', e.target as HTMLFormElement, 'tAL5L8Z5FRoC9hh2k')
    .then((result: EmailJSResponseStatus) => {
      console.log(result.text);
      this.form.reset()
    }, (error) => {
      console.log(error.text);
    });
  }

  private buildForm(): void {
    this.form = this.formBuilder.group({
      name: this.formBuilder.control(null),
      email: this.formBuilder.control(null),
      subject: this.formBuilder.control(null),
      message: this.formBuilder.control(null),

      allowedToCall: new FormControl(true),
      telNr: this.formBuilder.control(null),
    });

  }
}
