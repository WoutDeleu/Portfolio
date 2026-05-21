import { Component } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { environment } from "../environments/environment";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false,
    animations: [
      trigger('slideAnimation', [
        state('visible', style({
          opacity: 1,
          transform: 'none'
        })),
        state('hidden', style({
          opacity: 0,
          transform: 'translateX({{direction}}100%) scale(0.95)',
          position: 'absolute'
        }), { params: { direction: '-' } }),
        transition('visible <=> hidden', [
          animate('600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)')
        ])
      ]),
      trigger('terminalCloseAnimation', [
        state('idle', style({ transform: 'scale(1)', opacity: 1 })),
        state('close', style({ transform: 'scale(0)', opacity: 0 })),
        state('minimize', style({ transform: 'translateY(100vh) scale(0.1)', opacity: 0 })),
        state('maximize', style({ transform: 'scale(1.1)', opacity: 0 })),
        transition('idle => close', [
          animate('400ms cubic-bezier(0.4, 0.0, 1, 1)', keyframes([
            style({ transform: 'scale(1)', opacity: 1, offset: 0 }),
            style({ transform: 'scale(1.05)', opacity: 1, offset: 0.3 }),
            style({ transform: 'scale(0)', opacity: 0, offset: 1 })
          ]))
        ]),
        transition('idle => minimize', [
          animate('500ms cubic-bezier(0.4, 0.0, 0.6, 1)', keyframes([
            style({ transform: 'scale(1) translateY(0)', opacity: 1, offset: 0 }),
            style({ transform: 'scale(0.8) translateY(20vh)', opacity: 0.8, offset: 0.5 }),
            style({ transform: 'scale(0.1) translateY(100vh)', opacity: 0, offset: 1 })
          ]))
        ]),
        transition('idle => maximize', [
          animate('350ms ease-out', keyframes([
            style({ transform: 'scale(1)', opacity: 1, offset: 0 }),
            style({ transform: 'scale(1.2)', opacity: 0.8, offset: 0.5 }),
            style({ transform: 'scale(1.1)', opacity: 0, offset: 1 })
          ]))
        ]),
        transition('* => idle', [
          style({ transform: 'scale(1)', opacity: 1 }),
          animate('0ms')
        ])
      ])
    ]
})
export class AppComponent {
  title = 'Portfolio';
  production : boolean = environment.production;
  currentView: 'main' | 'terminal' = 'main';
  terminalCloseAnimation: 'idle' | 'close' | 'minimize' | 'maximize' = 'idle';

  onViewChange(view: 'main' | 'terminal') {
    this.currentView = view;
    if (view === 'terminal') {
      this.terminalCloseAnimation = 'idle';
    }
  }

  onTerminalAction(action: 'close' | 'minimize' | 'maximize') {
    this.terminalCloseAnimation = action;

    // Wait for animation to complete before switching view
    const animationDuration = action === 'minimize' ? 500 : action === 'close' ? 400 : 350;
    setTimeout(() => {
      this.currentView = 'main';
      this.terminalCloseAnimation = 'idle';
    }, animationDuration);
  }
}
