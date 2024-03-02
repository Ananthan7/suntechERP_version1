import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairMetalPurchaseDetailsComponent } from './repair-metal-purchase-details.component';

describe('RepairMetalPurchaseDetailsComponent', () => {
  let component: RepairMetalPurchaseDetailsComponent;
  let fixture: ComponentFixture<RepairMetalPurchaseDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairMetalPurchaseDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairMetalPurchaseDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
