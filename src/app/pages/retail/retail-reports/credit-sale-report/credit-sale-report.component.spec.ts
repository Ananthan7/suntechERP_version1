import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditSaleReportComponent } from './credit-sale-report.component';

describe('CreditSaleReportComponent', () => {
  let component: CreditSaleReportComponent;
  let fixture: ComponentFixture<CreditSaleReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditSaleReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditSaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
