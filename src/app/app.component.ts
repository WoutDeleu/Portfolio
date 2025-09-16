import { Component } from '@angular/core';
import * as personData from './models/data/JohnDoe.json';
import { environment } from "../environments/environment";
import { Person } from "./models/Person";
import {PersonJSON} from "./models/data/PersonJSON";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'Portfolio';
  terminalView: boolean = false;
  production : boolean = environment.production;

  personJSONObject : PersonJSON = personData as PersonJSON;
  person : Person = new Person(this.personJSONObject);

}
