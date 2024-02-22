import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairJewelleryReceiptComponent } from './repair-jewellery-receipt.component';

describe('RepairJewelleryReceiptComponent', () => {
  let component: RepairJewelleryReceiptComponent;
  let fixture: ComponentFixture<RepairJewelleryReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairJewelleryReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairJewelleryReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
