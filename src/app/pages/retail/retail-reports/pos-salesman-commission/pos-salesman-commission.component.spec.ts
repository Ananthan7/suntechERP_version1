import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSalesmanCommissionComponent } from './pos-salesman-commission.component';

describe('PosSalesmanCommissionComponent', () => {
  let component: PosSalesmanCommissionComponent;
  let fixture: ComponentFixture<PosSalesmanCommissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosSalesmanCommissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSalesmanCommissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
