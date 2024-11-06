import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostAndPriceTypesComponent } from './cost-and-price-types.component';

describe('CostAndPriceTypesComponent', () => {
  let component: CostAndPriceTypesComponent;
  let fixture: ComponentFixture<CostAndPriceTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostAndPriceTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostAndPriceTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
