import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeRegisterDevReportComponent } from './scheme-register-dev-report.component';

describe('SchemeRegisterDevReportComponent', () => {
  let component: SchemeRegisterDevReportComponent;
  let fixture: ComponentFixture<SchemeRegisterDevReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeRegisterDevReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeRegisterDevReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
