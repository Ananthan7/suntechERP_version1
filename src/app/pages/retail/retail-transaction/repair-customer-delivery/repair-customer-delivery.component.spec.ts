import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairCustomerDeliveryComponent } from './repair-customer-delivery.component';

describe('RepairCustomerDeliveryComponent', () => {
  let component: RepairCustomerDeliveryComponent;
  let fixture: ComponentFixture<RepairCustomerDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairCustomerDeliveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairCustomerDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
