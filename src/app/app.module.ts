import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {NgOptimizedImage} from "@angular/common";
import { ToggleSwitchComponent } from './components/toggle-switch/toggle-switch.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import {DownloadCVButtonComponent} from "./components/download-cv-button/download-cv-button.component";
import { SkillsComponent } from './components/cards/skills/skills.component';
import {MatIconModule} from "@angular/material/icon";
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { ScrollAnimationDirective } from './directives/scroll-animation.directive';
import { ViewToggleComponent } from './components/view-toggle/view-toggle.component';
import { TerminalViewComponent } from './components/terminal-view/terminal-view.component';

@NgModule({
    declarations: [
        AppComponent,
        ToggleSwitchComponent,
        NavigationBarComponent,
        SkillsComponent,
        ContactFormComponent,
        PortfolioComponent,
        ScrollAnimationDirective,
        ViewToggleComponent,
        TerminalViewComponent
    ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    NgOptimizedImage,
    FormsModule,
    ReactiveFormsModule,
    DownloadCVButtonComponent,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
