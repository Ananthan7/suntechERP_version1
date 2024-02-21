import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairDiamondPurchaseComponent } from './repair-diamond-purchase.component';

describe('RepairDiamondPurchaseComponent', () => {
  let component: RepairDiamondPurchaseComponent;
  let fixture: ComponentFixture<RepairDiamondPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairDiamondPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairDiamondPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
