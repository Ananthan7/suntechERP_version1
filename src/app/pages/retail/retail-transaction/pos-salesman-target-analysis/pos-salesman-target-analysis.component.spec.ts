import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSalesmanTargetAnalysisComponent } from './pos-salesman-target-analysis.component';

describe('PosSalesmanTargetAnalysisComponent', () => {
  let component: PosSalesmanTargetAnalysisComponent;
  let fixture: ComponentFixture<PosSalesmanTargetAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosSalesmanTargetAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSalesmanTargetAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
