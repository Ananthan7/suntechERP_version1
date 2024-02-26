import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosDailyClosingBranchComponent } from './pos-daily-closing-branch.component';

describe('PosDailyClosingBranchComponent', () => {
  let component: PosDailyClosingBranchComponent;
  let fixture: ComponentFixture<PosDailyClosingBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosDailyClosingBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosDailyClosingBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
