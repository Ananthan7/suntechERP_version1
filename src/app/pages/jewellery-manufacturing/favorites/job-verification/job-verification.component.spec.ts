import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobVerificationComponent } from './job-verification.component';

describe('JobVerificationComponent', () => {
  let component: JobVerificationComponent;
  let fixture: ComponentFixture<JobVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
