import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryPurchaseOtherAmountComponent } from './jewellery-purchase-other-amount.component';

describe('JewelleryPurchaseOtherAmountComponent', () => {
  let component: JewelleryPurchaseOtherAmountComponent;
  let fixture: ComponentFixture<JewelleryPurchaseOtherAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryPurchaseOtherAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryPurchaseOtherAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
