import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosDailyClosingSummaryComponent } from './pos-daily-closing-summary.component';

describe('PosDailyClosingSummaryComponent', () => {
  let component: PosDailyClosingSummaryComponent;
  let fixture: ComponentFixture<PosDailyClosingSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosDailyClosingSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosDailyClosingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
