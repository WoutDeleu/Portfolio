import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-age-badge',
    templateUrl: './age-badge.component.html',
    styleUrls: ['./age-badge.component.scss'],
    standalone: false
})
export class AgeBadgeComponent {
  @Input() age: number;
  @Input() birthDate: Date;
}
