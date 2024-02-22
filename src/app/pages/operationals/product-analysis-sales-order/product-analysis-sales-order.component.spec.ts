import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAnalysisSalesOrderComponent } from './product-analysis-sales-order.component';

describe('ProductAnalysisSalesOrderComponent', () => {
  let component: ProductAnalysisSalesOrderComponent;
  let fixture: ComponentFixture<ProductAnalysisSalesOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAnalysisSalesOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAnalysisSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
