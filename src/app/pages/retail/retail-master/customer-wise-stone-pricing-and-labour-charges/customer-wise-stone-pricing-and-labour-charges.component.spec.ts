import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWiseStonePricingAndLabourChargesComponent } from './customer-wise-stone-pricing-and-labour-charges.component';

describe('CustomerWiseStonePricingAndLabourChargesComponent', () => {
  let component: CustomerWiseStonePricingAndLabourChargesComponent;
  let fixture: ComponentFixture<CustomerWiseStonePricingAndLabourChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerWiseStonePricingAndLabourChargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerWiseStonePricingAndLabourChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
