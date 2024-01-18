import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterConsumablesDetailsComponent } from './cost-center-consumables-details.component';

describe('CostCenterConsumablesDetailsComponent', () => {
  let component: CostCenterConsumablesDetailsComponent;
  let fixture: ComponentFixture<CostCenterConsumablesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCenterConsumablesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterConsumablesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
