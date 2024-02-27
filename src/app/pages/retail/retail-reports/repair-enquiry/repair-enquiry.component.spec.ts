import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairEnquiryComponent } from './repair-enquiry.component';

describe('RepairEnquiryComponent', () => {
  let component: RepairEnquiryComponent;
  let fixture: ComponentFixture<RepairEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairEnquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
