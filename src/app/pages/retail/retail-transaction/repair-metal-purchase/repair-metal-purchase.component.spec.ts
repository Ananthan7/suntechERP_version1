import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairMetalPurchaseComponent } from './repair-metal-purchase.component';

describe('RepairMetalPurchaseComponent', () => {
  let component: RepairMetalPurchaseComponent;
  let fixture: ComponentFixture<RepairMetalPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairMetalPurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairMetalPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
