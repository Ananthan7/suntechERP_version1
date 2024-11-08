import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeWiseSalesAnalysisComponent } from './time-wise-sales-analysis.component';

describe('TimeWiseSalesAnalysisComponent', () => {
  let component: TimeWiseSalesAnalysisComponent;
  let fixture: ComponentFixture<TimeWiseSalesAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeWiseSalesAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeWiseSalesAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
