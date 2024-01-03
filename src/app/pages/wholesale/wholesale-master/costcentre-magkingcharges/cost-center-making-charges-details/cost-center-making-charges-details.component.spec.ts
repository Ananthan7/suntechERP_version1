import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterMakingChargesDetailsComponent } from './cost-center-making-charges-details.component';

describe('CostCenterMakingChargesDetailsComponent', () => {
  let component: CostCenterMakingChargesDetailsComponent;
  let fixture: ComponentFixture<CostCenterMakingChargesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCenterMakingChargesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterMakingChargesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
