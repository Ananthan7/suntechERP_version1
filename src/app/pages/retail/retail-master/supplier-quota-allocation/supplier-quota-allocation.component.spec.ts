import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierQuotaAllocationComponent } from './supplier-quota-allocation.component';

describe('SupplierQuotaAllocationComponent', () => {
  let component: SupplierQuotaAllocationComponent;
  let fixture: ComponentFixture<SupplierQuotaAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SupplierQuotaAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierQuotaAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
