import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesVoucherRedeemComponent } from './sales-voucher-redeem.component';

describe('SalesVoucherRedeemComponent', () => {
  let component: SalesVoucherRedeemComponent;
  let fixture: ComponentFixture<SalesVoucherRedeemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesVoucherRedeemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesVoucherRedeemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
