import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosDailyClosingReportComponent } from './pos-daily-closing-report.component';

describe('PosDailyClosingReportComponent', () => {
  let component: PosDailyClosingReportComponent;
  let fixture: ComponentFixture<PosDailyClosingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosDailyClosingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosDailyClosingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
