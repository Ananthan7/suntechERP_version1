import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchkeyMetricsComponent } from './branchkey-metrics.component';

describe('BranchkeyMetricsComponent', () => {
  let component: BranchkeyMetricsComponent;
  let fixture: ComponentFixture<BranchkeyMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchkeyMetricsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchkeyMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
