import { Component, OnInit } from '@angular/core';

interface TerminalLine {
  text: string;
  type: 'command' | 'output' | 'info';
}

@Component({
  selector: 'app-terminal-view',
  standalone: false,
  templateUrl: './terminal-view.component.html',
  styleUrl: './terminal-view.component.scss'
})
export class TerminalViewComponent implements OnInit {
  lines: TerminalLine[] = [];
  currentInput = '';

  ngOnInit() {
    this.initializeTerminal();
  }

  initializeTerminal() {
    this.lines = [
      { text: 'Welcome to Wout\'s Portfolio Terminal v1.0', type: 'info' },
      { text: '============================================', type: 'info' },
      { text: '', type: 'output' },
      { text: 'Type "help" for available commands', type: 'info' },
      { text: '', type: 'output' },
      { text: '> help', type: 'command' },
      { text: 'Available commands:', type: 'output' },
      { text: '  about    - Learn about Wout', type: 'output' },
      { text: '  skills   - View technical skills', type: 'output' },
      { text: '  projects - See portfolio projects', type: 'output' },
      { text: '  contact  - Get contact information', type: 'output' },
      { text: '  clear    - Clear terminal screen', type: 'output' },
      { text: '', type: 'output' },
    ];
  }
}
