import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalViewComponent } from './terminal-view.component';

describe('TerminalViewComponent', () => {
  let component: TerminalViewComponent;
  let fixture: ComponentFixture<TerminalViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TerminalViewComponent]
    });
    fixture = TestBed.createComponent(TerminalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
