import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairSaleComponent } from './repair-sale.component';

describe('RepairSaleComponent', () => {
  let component: RepairSaleComponent;
  let fixture: ComponentFixture<RepairSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairSaleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
