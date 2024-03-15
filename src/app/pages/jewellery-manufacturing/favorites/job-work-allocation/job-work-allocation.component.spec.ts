import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobWorkAllocationComponent } from './job-work-allocation.component';

describe('JobWorkAllocationComponent', () => {
  let component: JobWorkAllocationComponent;
  let fixture: ComponentFixture<JobWorkAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobWorkAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobWorkAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
