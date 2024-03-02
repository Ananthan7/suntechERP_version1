import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairDiamondPurchaseDetailComponent } from './repair-diamond-purchase-detail.component';

describe('RepairDiamondPurchaseDetailComponent', () => {
  let component: RepairDiamondPurchaseDetailComponent;
  let fixture: ComponentFixture<RepairDiamondPurchaseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairDiamondPurchaseDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairDiamondPurchaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
