import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailSalesKaratWiseProfitComponent } from './retail-sales-karat-wise-profit.component';

describe('RetailSalesKaratWiseProfitComponent', () => {
  let component: RetailSalesKaratWiseProfitComponent;
  let fixture: ComponentFixture<RetailSalesKaratWiseProfitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailSalesKaratWiseProfitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailSalesKaratWiseProfitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
