import {Component, Input} from '@angular/core';
import {Person} from "../../../models/Person";

@Component({
    selector: 'app-location-badge',
    templateUrl: './location-badge.component.html',
    styleUrls: ['./location-badge.component.scss'],
    standalone: false
})
export class LocationBadgeComponent {
  @Input() person : Person;

  openGoogleMaps() {
    const url : string = "https://www.google.com/maps/place/" + this.person.city;
    window.open(url, '_blank');
  }

}
