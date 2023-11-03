import {Component, Input} from '@angular/core';
import {Person} from "../../../models/Person";

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalviewComponent {
  @Input() person : Person;
}
