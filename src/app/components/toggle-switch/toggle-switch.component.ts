// toggle-switch.component.ts
import {Component, OnInit, Input, Inject, EventEmitter, Output} from '@angular/core';

@Component({
    selector: 'app-toggle-switch',
    templateUrl: './toggle-switch.component.html',
    styleUrls: ['./toggle-switch.component.scss'],
    standalone: false
})
export class ToggleSwitchComponent implements OnInit {
  @Input() isToggled!: boolean; // Input om de stand van de toggle te beheren
  @Output() toggleView : EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void { }

  toggleSwitch() {
    this.isToggled = !this.isToggled;
    this.toggleView.emit(this.isToggled);
  }
}

