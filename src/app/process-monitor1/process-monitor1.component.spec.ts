import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessMonitor1Component } from './process-monitor1.component';

describe('ProcessMonitor1Component', () => {
  let component: ProcessMonitor1Component;
  let fixture: ComponentFixture<ProcessMonitor1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProcessMonitor1Component]
    });
    fixture = TestBed.createComponent(ProcessMonitor1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
