import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCurrencyReceiptDetailsComponent } from './pos-currency-receipt-details.component';

describe('PosCurrencyReceiptDetailsComponent', () => {
  let component: PosCurrencyReceiptDetailsComponent;
  let fixture: ComponentFixture<PosCurrencyReceiptDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosCurrencyReceiptDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosCurrencyReceiptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
