import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

interface TerminalLine {
  text: string;
  type: 'command' | 'output' | 'info' | 'error';
  displayText?: string;
  isTyping?: boolean;
}

@Component({
  selector: 'app-terminal-view',
  standalone: false,
  templateUrl: './terminal-view.component.html',
  styleUrl: './terminal-view.component.scss'
})
export class TerminalViewComponent implements OnInit, AfterViewInit {
  @ViewChild('terminalInput') terminalInput!: ElementRef<HTMLInputElement>;
  @ViewChild('terminalContent') terminalContent!: ElementRef<HTMLDivElement>;

  lines: TerminalLine[] = [];
  currentInput = '';
  commandHistory: string[] = [];
  historyIndex = -1;
  isTyping = false;
  secretPassword = '';
  hasFoundSecret = false;
  showRickroll = false;

  private introLines = [
    { text: '   ___       __               __     ____             __  ____      ___    ', type: 'info' as const },
    { text: '  / _ \\ ___ / /_  ___  ___  / /    / __ \\___  ___  / /_/ _/ /__  / (_)__ ', type: 'info' as const },
    { text: ' / // // -_) / /_/ _ \\/ _ \\/ /    / /_/ / _ \\/ _ \\/ __/ _/ / _ \\/ / / _ \\', type: 'info' as const },
    { text: '/____/ \\__/_/\\__/\\___/_//_/_/     \\____/\\___/_//_/\\__/_/ /_/\\___/_/_/\\___/', type: 'info' as const },
    { text: '', type: 'output' as const },
    { text: '╔════════════════════════════════════════════════════════════════════════════╗', type: 'info' as const },
    { text: '║                    Welcome to Wout\'s Portfolio Terminal v1.0               ║', type: 'info' as const },
    { text: '╚════════════════════════════════════════════════════════════════════════════╝', type: 'info' as const },
    { text: '', type: 'output' as const },
    { text: '💻 Full Stack Developer | 🚀 Cloud Enthusiast | ⚡ Performance Optimizer', type: 'info' as const },
    { text: '', type: 'output' as const },
    { text: 'Type "help" for available commands', type: 'output' as const },
    { text: '', type: 'output' as const },
  ];

  ngOnInit() {
    this.lines = [];
    this.generateSecretPassword();
    this.typeIntro();
  }

  generateSecretPassword() {
    const adjectives = ['cosmic', 'quantum', 'neural', 'digital', 'cyber', 'virtual'];
    const nouns = ['matrix', 'portal', 'gateway', 'nexus', 'vortex', 'dimension'];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 999) + 100;
    this.secretPassword = `${randomAdj}-${randomNoun}-${randomNum}`;
    console.log('%c[DEBUG] Auth token generated', 'color: #666; font-size: 11px;');
    console.log(`%cauth.token="${this.secretPassword}"`, 'color: #888; font-size: 12px; font-family: monospace;');
  }

  ngAfterViewInit() {
    // Keep trying to focus until intro is done
    const focusInterval = setInterval(() => {
      if (!this.isTyping) {
        this.focusInput();
        clearInterval(focusInterval);
      }
    }, 100);

    // Backup timeout in case something goes wrong
    setTimeout(() => {
      clearInterval(focusInterval);
      this.focusInput();
    }, this.introLines.length * 50 + 1000);
  }

  async typeIntro() {
    this.isTyping = true;

    for (let i = 0; i < this.introLines.length; i++) {
      const line = { ...this.introLines[i], displayText: '', isTyping: true };
      this.lines.push(line);

      // Type out character by character
      if (line.text.length > 0) {
        for (let j = 0; j < line.text.length; j++) {
          line.displayText = line.text.substring(0, j + 1);
          await this.delay(8);
          if (j % 3 === 0) this.scrollToBottom();
        }
      }

      line.isTyping = false;
      await this.delay(25);
      this.scrollToBottom();
    }

    this.isTyping = false;
    this.focusInput();
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  initializeTerminal() {
    this.lines = [];
    this.typeIntro();
  }

  focusInput() {
    setTimeout(() => {
      if (this.terminalInput && this.terminalInput.nativeElement) {
        this.terminalInput.nativeElement.focus();
      }
    }, 0);
  }

  handleKeyDown(event: KeyboardEvent) {
    if (this.isTyping) {
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.executeCommand(this.currentInput.trim());
      this.currentInput = '';
      this.historyIndex = -1;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateHistory(-1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.navigateHistory(1);
    }
  }

  navigateHistory(direction: number) {
    if (this.commandHistory.length === 0) return;

    const newIndex = this.historyIndex + direction;

    if (newIndex >= 0 && newIndex < this.commandHistory.length) {
      this.historyIndex = newIndex;
      this.currentInput = this.commandHistory[this.commandHistory.length - 1 - this.historyIndex];
    } else if (newIndex < 0) {
      this.historyIndex = -1;
      this.currentInput = '';
    }
  }

  async executeCommand(command: string) {
    if (!command) return;

    this.isTyping = true;
    this.lines.push({ text: `> ${command}`, type: 'command', displayText: `> ${command}` });
    this.commandHistory.push(command);

    const cmd = command.toLowerCase();

    switch (cmd) {
      case 'help':
        await this.showHelp();
        break;
      case 'whoami':
        await this.showWhoami();
        break;
      case 'skills':
        await this.showSkills();
        break;
      case 'projects':
        await this.showProjects();
        break;
      case 'contact':
        await this.showContact();
        break;
      case 'secret':
        await this.showSecret();
        break;
      case 'clear':
        this.clearTerminal();
        this.isTyping = false;
        this.focusInput();
        return;
      default:
        // Check if it's a sudo command
        if (cmd.startsWith('sudo ')) {
          const sudoArgs = command.substring(5).trim().split(' ');
          const sudoCommand = sudoArgs[0];
          const sudoPassword = sudoArgs.slice(1).join(' ');

          if (sudoCommand === 'secret') {
            await this.handleSudo(sudoPassword);
          } else {
            await this.typeOutLine(`sudo: ${sudoCommand}: command not found`, 'error');
          }
        } else {
          await this.typeOutLine(`Command not found: ${command}`, 'error');
          await this.typeOutLine('Type "help" for available commands', 'output');
        }
    }

    this.lines.push({ text: '', type: 'output', displayText: '' });
    this.scrollToBottom();
    this.isTyping = false;
    this.focusInput();
  }

  async typeOutLine(text: string, type: 'command' | 'output' | 'info' | 'error', speed: number = 22) {
    const line: TerminalLine = { text, type, displayText: '', isTyping: true };
    this.lines.push(line);

    for (let i = 0; i < text.length; i++) {
      line.displayText = text.substring(0, i + 1);
      await this.delay(speed);
      if (i % 3 === 0) this.scrollToBottom();
    }

    line.isTyping = false;
    await this.delay(40);
    this.scrollToBottom();
  }

  async showHelp() {
    await this.typeOutLine('Available commands:', 'output');
    await this.typeOutLine('  help     - Show this help message', 'output');
    await this.typeOutLine('  whoami   - Learn about Wout', 'output');
    await this.typeOutLine('  skills   - View technical skills', 'output');
    await this.typeOutLine('  projects - See portfolio projects', 'output');
    await this.typeOutLine('  contact  - Get contact information', 'output');
    await this.typeOutLine('  secret   - Find hidden easter egg', 'output');
    await this.typeOutLine('  clear    - Clear terminal screen', 'output');
  }

  async showWhoami() {
    await this.typeOutLine('Wout Deleu', 'info', 18);
    await this.typeOutLine('Full Stack Developer passionate about creating modern web applications.', 'output');
    await this.typeOutLine('Experienced in Angular, TypeScript, and cloud technologies.', 'output');
  }

  async showSkills() {
    await this.typeOutLine('Technical Skills:', 'info', 18);
    await this.typeOutLine('  • Frontend: Angular, TypeScript, HTML5, CSS3, SCSS', 'output');
    await this.typeOutLine('  • Backend: Node.js, Java, Python', 'output');
    await this.typeOutLine('  • Cloud: AWS, Azure, Docker', 'output');
    await this.typeOutLine('  • Database: PostgreSQL, MongoDB', 'output');
  }

  async showProjects() {
    await this.typeOutLine('Portfolio Projects:', 'info', 18);
    await this.typeOutLine('  • Interactive Portfolio - This website!', 'output');
    await this.typeOutLine('  • Terminal Interface - The view you\'re using now', 'output');
    this.lines.push({ text: '', type: 'output', displayText: '' });
    await this.typeOutLine('Visit the portfolio view to see more details.', 'output');
  }

  async showContact() {
    await this.typeOutLine('Contact Information:', 'info', 18);
    await this.typeOutLine('  GitHub: github.com/WoutDeleu', 'output');
    await this.typeOutLine('  Use the contact form in the portfolio view to get in touch!', 'output');
  }

  async showSecret() {
    await this.typeOutLine('🔍 Searching for hidden secrets...', 'output');
    await this.delay(500);
    await this.typeOutLine('Permission denied. Try with elevated privileges?', 'output');
    await this.typeOutLine('💡 Hint: Developers always debug.', 'info', 18);
    await this.delay(300);
    console.log('%c[INFO] Authentication credentials available in console output', 'color: #888; font-size: 11px;');
    console.log(`%cauth.token="${this.secretPassword}"`, 'color: #888; font-size: 12px; font-family: monospace;');
    console.log('%c// Use: sudo secret <token>', 'color: #666; font-size: 11px; font-style: italic;');
  }

  async handleSudo(password: string) {
    if (!this.hasFoundSecret) {
      await this.typeOutLine('[sudo] password required', 'output');
      await this.delay(300);

      if (password === this.secretPassword) {
        this.hasFoundSecret = true;
        await this.typeOutLine('✓ Authentication successful!', 'info', 18);
        await this.delay(500);
        await this.typeOutLine('Accessing restricted area...', 'output');
        await this.delay(800);
        await this.typeOutLine('Loading video player...', 'output');
        await this.delay(500);

        this.showRickroll = true;
        await this.delay(1000);

        await this.typeOutLine('', 'output');
        await this.typeOutLine('🎵 Classic 80s Music Video Loading... 🎵', 'info', 18);
        await this.typeOutLine('', 'output');
        await this.typeOutLine('🎉 Congratulations! You\'ve been rickrolled! 🎉', 'info', 18);
        await this.typeOutLine('Enjoy this timeless classic from 1987!', 'output');
      } else {
        await this.typeOutLine('✗ sudo: incorrect password', 'error');
        await this.typeOutLine('Hint: Use the "secret" command first!', 'output');
      }
    } else {
      await this.typeOutLine('✓ Access already granted!', 'info', 18);
      await this.typeOutLine('Rickroll video already playing! 😄', 'output');
      this.showRickroll = true;
    }
  }

  clearTerminal() {
    this.lines = [];
    this.initializeTerminal();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.terminalContent) {
        this.terminalContent.nativeElement.scrollTop = this.terminalContent.nativeElement.scrollHeight;
      }
    }, 0);
  }

  onTerminalClick() {
    this.focusInput();
  }
}
