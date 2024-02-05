import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobAllocationMeltingComponent } from './job-allocation-melting.component';

describe('JobAllocationMeltingComponent', () => {
  let component: JobAllocationMeltingComponent;
  let fixture: ComponentFixture<JobAllocationMeltingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobAllocationMeltingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobAllocationMeltingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
