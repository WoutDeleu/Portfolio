import { Component, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-view-toggle',
  standalone: false,
  templateUrl: './view-toggle.component.html',
  styleUrl: './view-toggle.component.scss'
})
export class ViewToggleComponent {
  @Output() viewChange = new EventEmitter<'main' | 'terminal'>();
  @Input() currentView: 'main' | 'terminal' = 'main';

  toggleView() {
    this.currentView = this.currentView === 'main' ? 'terminal' : 'main';
    this.viewChange.emit(this.currentView);
  }
}
