import {Component, Input} from '@angular/core';
import {environment} from "../../../environments/environment";
import {PersonJSON} from "../../models/data/PersonJSON";
import * as personData from "../../models/data/JohnDoe.json";
import {Person} from "../../models/Person";

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
    standalone: false
})
export class OverviewComponent {
  @Input() person : Person;

}
