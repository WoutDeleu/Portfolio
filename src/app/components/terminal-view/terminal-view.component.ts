import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { DataService, PersonalInfo } from '../../services/data.service';
import { EmailService } from '../../services/email.service';

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
  @Output() closeWindow = new EventEmitter<'close' | 'minimize' | 'maximize'>();

  lines: TerminalLine[] = [];
  currentInput = '';
  commandHistory: string[] = [];
  historyIndex = -1;
  isTyping = false;
  secretPassword = '';
  hasFoundSecret = false;
  showRickroll = false;
  personalInfo: PersonalInfo | null = null;
  skills: any[] = [];
  interests: any[] = [];
  contactFormMode = false;
  contactFormStep: 'name' | 'email' | 'subject' | 'message' | 'confirm' | null = null;
  contactFormData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(
    private dataService: DataService,
    private emailService: EmailService
  ) {}

  private getIntroLines(): TerminalLine[] {
    const firstName = this.personalInfo?.firstName || 'Wout';
    const welcomeText = `Welcome to ${firstName}'s Portfolio Terminal v1.0`;
    const padding = Math.floor((78 - welcomeText.length) / 2);
    const paddedWelcome = '║' + ' '.repeat(padding) + welcomeText + ' '.repeat(78 - padding - welcomeText.length) + '║';

    return [
      { text: '   ___       __               __     ____             __  ____      ___    ', type: 'info' },
      { text: '  / _ \\ ___ / /_  ___  ___  / /    / __ \\___  ___  / /_/ _/ /__  / (_)__ ', type: 'info' },
      { text: ' / // // -_) / /_/ _ \\/ _ \\/ /    / /_/ / _ \\/ _ \\/ __/ _/ / _ \\/ / / _ \\', type: 'info' },
      { text: '/____/ \\__/_/\\__/\\___/_//_/_/     \\____/\\___/_//_/\\__/_/ /_/\\___/_/_/\\___/', type: 'info' },
      { text: '', type: 'output' },
      { text: '╔════════════════════════════════════════════════════════════════════════════╗', type: 'info' },
      { text: paddedWelcome, type: 'info' },
      { text: '╚════════════════════════════════════════════════════════════════════════════╝', type: 'info' },
      { text: '', type: 'output' },
      { text: '💻 Full Stack Developer | 🚀 Cloud Enthusiast | ⚡ Performance Optimizer', type: 'info' },
      { text: '', type: 'output' },
      { text: 'Type "help" for available commands', type: 'output' },
      { text: '', type: 'output' },
    ];
  }

  ngOnInit() {
    this.lines = [];
    this.generateSecretPassword();
    this.loadData();
    this.typeIntro();
  }

  loadData() {
    this.dataService.getPersonalInfo().subscribe(info => {
      this.personalInfo = info;
    });

    this.dataService.getSkills().subscribe(skills => {
      this.skills = skills;
    });

    this.dataService.getInterests().subscribe(interests => {
      this.interests = interests;
    });
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
    }, 13 * 50 + 1000); // 13 intro lines
  }

  async typeIntro() {
    this.isTyping = true;
    const introLines = this.getIntroLines();

    for (let i = 0; i < introLines.length; i++) {
      const line = { ...introLines[i], displayText: '', isTyping: true };
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
      if (this.contactFormMode) {
        this.handleContactFormInput(this.currentInput.trim());
      } else {
        this.executeCommand(this.currentInput.trim());
      }
      this.currentInput = '';
      this.historyIndex = -1;
    } else if (event.key === 'ArrowUp' && !this.contactFormMode) {
      event.preventDefault();
      this.navigateHistory(-1);
    } else if (event.key === 'ArrowDown' && !this.contactFormMode) {
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
    const fullName = this.personalInfo
      ? `${this.personalInfo.firstName} ${this.personalInfo.lastName}`
      : 'Wout Deleu';
    const description = this.personalInfo?.description || 'Full Stack Developer passionate about creating modern web applications.';

    await this.typeOutLine(fullName, 'info', 18);
    await this.typeOutLine(description, 'output');

    if (this.personalInfo?.contact?.location) {
      await this.typeOutLine(`📍 Location: ${this.personalInfo.contact.location}`, 'output');
    }
    if (this.personalInfo?.education?.degree) {
      await this.typeOutLine(`🎓 Education: ${this.personalInfo.education.degree}`, 'output');
    }
  }

  async showSkills() {
    await this.typeOutLine('Technical Skills:', 'info', 18);

    if (this.skills.length > 0) {
      for (const skill of this.skills) {
        const proficiencyBar = '█'.repeat(Math.floor(skill.proficiency / 10)) + '░'.repeat(10 - Math.floor(skill.proficiency / 10));
        await this.typeOutLine(`  • ${skill.name.padEnd(12)} [${proficiencyBar}] ${skill.proficiency}%`, 'output');
      }
    } else {
      await this.typeOutLine('  • Frontend: Angular, TypeScript, HTML5, CSS3, SCSS', 'output');
      await this.typeOutLine('  • Backend: Node.js, Java, Python', 'output');
      await this.typeOutLine('  • Cloud: AWS, Azure, Docker', 'output');
      await this.typeOutLine('  • Database: PostgreSQL, MongoDB', 'output');
    }
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

    if (this.personalInfo?.contact) {
      if (this.personalInfo.contact.email) {
        await this.typeOutLine(`  📧 Email: ${this.personalInfo.contact.email}`, 'output');
      }
      if (this.personalInfo.contact.phone) {
        await this.typeOutLine(`  📱 Phone: ${this.personalInfo.contact.phone}`, 'output');
      }
      if (this.personalInfo.contact.github) {
        await this.typeOutLine(`  🐙 GitHub: ${this.personalInfo.contact.github}`, 'output');
      }
      if (this.personalInfo.contact.linkedin) {
        await this.typeOutLine(`  💼 LinkedIn: ${this.personalInfo.contact.linkedin}`, 'output');
      }
    } else {
      await this.typeOutLine('  GitHub: github.com/WoutDeleu', 'output');
    }

    await this.typeOutLine('', 'output');
    await this.typeOutLine('  💌 Would you like to send a message? (yes/no)', 'info');

    // Start contact form mode
    this.contactFormMode = true;
    this.contactFormStep = 'name';
  }

  async handleContactFormInput(input: string) {
    this.isTyping = true;
    this.lines.push({ text: `> ${input}`, type: 'command', displayText: `> ${input}` });

    if (this.contactFormStep === 'name') {
      if (input.toLowerCase() === 'yes' || input.toLowerCase() === 'y') {
        await this.typeOutLine('Great! Let\'s get started.', 'output');
        await this.typeOutLine('', 'output');
        await this.typeOutLine('Please enter your name:', 'info');
        this.contactFormStep = 'email';
      } else {
        await this.typeOutLine('No problem! Feel free to reach out anytime.', 'output');
        this.contactFormMode = false;
        this.contactFormStep = null;
      }
    } else if (this.contactFormStep === 'email') {
      this.contactFormData.name = input;
      await this.typeOutLine(`Hello ${input}! 👋`, 'output');
      await this.typeOutLine('', 'output');
      await this.typeOutLine('Please enter your email address:', 'info');
      this.contactFormStep = 'subject';
    } else if (this.contactFormStep === 'subject') {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        await this.typeOutLine('⚠️  Invalid email format. Please try again:', 'error');
      } else {
        this.contactFormData.email = input;
        await this.typeOutLine('✓ Email saved!', 'output');
        await this.typeOutLine('', 'output');
        await this.typeOutLine('What is the subject of your message?', 'info');
        this.contactFormStep = 'message';
      }
    } else if (this.contactFormStep === 'message') {
      this.contactFormData.subject = input;
      await this.typeOutLine('✓ Subject saved!', 'output');
      await this.typeOutLine('', 'output');
      await this.typeOutLine('Please enter your message:', 'info');
      await this.typeOutLine('(Type your message and press Enter when done)', 'output');
      this.contactFormStep = 'confirm';
    } else if (this.contactFormStep === 'confirm') {
      this.contactFormData.message = input;
      await this.typeOutLine('✓ Message saved!', 'output');
      await this.typeOutLine('', 'output');
      await this.typeOutLine('─────────────────────────────────────', 'output');
      await this.typeOutLine('📋 Message Summary:', 'info', 18);
      await this.typeOutLine(`  Name:    ${this.contactFormData.name}`, 'output');
      await this.typeOutLine(`  Email:   ${this.contactFormData.email}`, 'output');
      await this.typeOutLine(`  Subject: ${this.contactFormData.subject}`, 'output');
      await this.typeOutLine(`  Message: ${this.contactFormData.message}`, 'output');
      await this.typeOutLine('─────────────────────────────────────', 'output');
      await this.typeOutLine('', 'output');
      await this.typeOutLine('✉️  Sending message...', 'info');

      // Actually send the email
      try {
        await this.emailService.sendEmail({
          name: this.contactFormData.name,
          email: this.contactFormData.email,
          subject: this.contactFormData.subject,
          message: this.contactFormData.message
        });
        await this.delay(500);
        await this.typeOutLine('✓ Message sent successfully! 🎉', 'info', 18);
        await this.typeOutLine('Thank you for reaching out! I\'ll get back to you soon.', 'output');
      } catch (error) {
        await this.delay(500);
        await this.typeOutLine('✗ Failed to send message.', 'error');
        await this.typeOutLine('Please try again or use the contact form in the portfolio view.', 'output');
        console.error('Email send error:', error);
      }

      // Reset form
      this.contactFormMode = false;
      this.contactFormStep = null;
      this.contactFormData = {
        name: '',
        email: '',
        subject: '',
        message: ''
      };
    }

    this.lines.push({ text: '', type: 'output', displayText: '' });
    this.scrollToBottom();
    this.isTyping = false;
    this.focusInput();
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

  closeTerminal(event: Event) {
    event.stopPropagation();
    this.closeWindow.emit('close');
  }

  minimizeTerminal(event: Event) {
    event.stopPropagation();
    this.closeWindow.emit('minimize');
  }

  maximizeTerminal(event: Event) {
    event.stopPropagation();
    this.closeWindow.emit('maximize');
  }
}
