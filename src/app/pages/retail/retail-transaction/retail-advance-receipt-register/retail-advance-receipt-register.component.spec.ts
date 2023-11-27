import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailAdvanceReceiptRegisterComponent } from './retail-advance-receipt-register.component';

describe('RetailAdvanceReceiptRegisterComponent', () => {
  let component: RetailAdvanceReceiptRegisterComponent;
  let fixture: ComponentFixture<RetailAdvanceReceiptRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailAdvanceReceiptRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailAdvanceReceiptRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
