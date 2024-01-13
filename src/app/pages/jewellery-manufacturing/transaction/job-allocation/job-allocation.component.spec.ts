import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAllocationComponent } from './job-allocation.component';

describe('JobAllocationComponent', () => {
  let component: JobAllocationComponent;
  let fixture: ComponentFixture<JobAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
