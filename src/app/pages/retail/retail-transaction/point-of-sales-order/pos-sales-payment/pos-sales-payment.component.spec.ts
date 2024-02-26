import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSalesPaymentComponent } from './pos-sales-payment.component';

describe('PosSalesPaymentComponent', () => {
  let component: PosSalesPaymentComponent;
  let fixture: ComponentFixture<PosSalesPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosSalesPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSalesPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
