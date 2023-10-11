import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobClosingComponent } from './job-closing.component';

describe('JobClosingComponent', () => {
  let component: JobClosingComponent;
  let fixture: ComponentFixture<JobClosingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobClosingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobClosingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
