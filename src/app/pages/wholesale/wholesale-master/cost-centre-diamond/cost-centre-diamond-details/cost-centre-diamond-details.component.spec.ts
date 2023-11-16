import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCentreDiamondDetailsComponent } from './cost-centre-diamond-details.component';

describe('CostCentreDiamondDetailsComponent', () => {
  let component: CostCentreDiamondDetailsComponent;
  let fixture: ComponentFixture<CostCentreDiamondDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCentreDiamondDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCentreDiamondDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
