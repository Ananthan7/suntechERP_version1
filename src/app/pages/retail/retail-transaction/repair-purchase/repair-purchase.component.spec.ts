import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairPurchaseComponent } from './repair-purchase.component';

describe('RepairPurchaseComponent', () => {
  let component: RepairPurchaseComponent;
  let fixture: ComponentFixture<RepairPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
