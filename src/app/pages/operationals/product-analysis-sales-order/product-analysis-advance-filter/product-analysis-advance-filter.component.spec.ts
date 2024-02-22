import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAnalysisAdvanceFilterComponent } from './product-analysis-advance-filter.component';

describe('ProductAnalysisAdvanceFilterComponent', () => {
  let component: ProductAnalysisAdvanceFilterComponent;
  let fixture: ComponentFixture<ProductAnalysisAdvanceFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductAnalysisAdvanceFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAnalysisAdvanceFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
