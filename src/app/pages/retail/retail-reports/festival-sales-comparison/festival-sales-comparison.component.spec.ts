import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FestivalSalesComparisonComponent } from './festival-sales-comparison.component';

describe('FestivalSalesComparisonComponent', () => {
  let component: FestivalSalesComparisonComponent;
  let fixture: ComponentFixture<FestivalSalesComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FestivalSalesComparisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FestivalSalesComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
