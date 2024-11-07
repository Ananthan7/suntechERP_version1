import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanWiseProfitAnalysisComponent } from './salesman-wise-profit-analysis.component';

describe('SalesmanWiseProfitAnalysisComponent', () => {
  let component: SalesmanWiseProfitAnalysisComponent;
  let fixture: ComponentFixture<SalesmanWiseProfitAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesmanWiseProfitAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesmanWiseProfitAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
