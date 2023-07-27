import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Line1040Component } from './line1040.component';

describe('Line1040Component', () => {
  let component: Line1040Component;
  let fixture: ComponentFixture<Line1040Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Line1040Component],
    });
    fixture = TestBed.createComponent(Line1040Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
