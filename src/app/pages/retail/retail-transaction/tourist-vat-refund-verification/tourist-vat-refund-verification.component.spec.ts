import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TouristVatRefundVerificationComponent } from './tourist-vat-refund-verification.component';

describe('TouristVatRefundVerificationComponent', () => {
  let component: TouristVatRefundVerificationComponent;
  let fixture: ComponentFixture<TouristVatRefundVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TouristVatRefundVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TouristVatRefundVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
