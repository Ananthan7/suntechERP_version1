import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairPurchaseDetailsComponent } from './repair-purchase-details.component';

describe('RepairPurchaseDetailsComponent', () => {
  let component: RepairPurchaseDetailsComponent;
  let fixture: ComponentFixture<RepairPurchaseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairPurchaseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairPurchaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
