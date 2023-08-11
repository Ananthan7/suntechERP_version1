import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallBranchAnalysisComponent } from './overall-branch-analysis.component';

describe('OverallBranchAnalysisComponent', () => {
  let component: OverallBranchAnalysisComponent;
  let fixture: ComponentFixture<OverallBranchAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OverallBranchAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallBranchAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
