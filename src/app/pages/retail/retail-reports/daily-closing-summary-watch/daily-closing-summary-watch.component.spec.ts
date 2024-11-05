import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyClosingSummaryWatchComponent } from './daily-closing-summary-watch.component';

describe('DailyClosingSummaryWatchComponent', () => {
  let component: DailyClosingSummaryWatchComponent;
  let fixture: ComponentFixture<DailyClosingSummaryWatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyClosingSummaryWatchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyClosingSummaryWatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
