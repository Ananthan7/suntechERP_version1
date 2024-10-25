import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEnquiryComponent } from './customer-enquiry.component';

describe('CustomerEnquiryComponent', () => {
  let component: CustomerEnquiryComponent;
  let fixture: ComponentFixture<CustomerEnquiryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerEnquiryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
