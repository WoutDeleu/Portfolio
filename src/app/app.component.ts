import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import * as personData from './models/data/JohnDoe.json';
import { environment } from "../environments/environment";
import { Person } from "./models/Person";
import {PersonJSON} from "./models/data/PersonJSON";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false,
    animations: [
      trigger('slideAnimation', [
        state('visible', style({
          opacity: 1,
          transform: 'translateX(0) scale(1)'
        })),
        state('hidden', style({
          opacity: 0,
          transform: 'translateX({{direction}}100%) scale(0.95)',
          position: 'absolute'
        }), { params: { direction: '-' } }),
        transition('visible <=> hidden', [
          animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)')
        ])
      ])
    ]
})
export class AppComponent {
  title = 'Portfolio';
  terminalView: boolean = false;
  production : boolean = environment.production;
  currentView: 'main' | 'terminal' = 'main';

  personJSONObject : PersonJSON = personData as PersonJSON;
  person : Person = new Person(this.personJSONObject);

  onViewChange(view: 'main' | 'terminal') {
    this.currentView = view;
  }
}
