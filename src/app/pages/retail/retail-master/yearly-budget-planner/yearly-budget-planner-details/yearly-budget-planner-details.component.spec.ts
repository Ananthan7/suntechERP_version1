import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyBudgetPlannerDetailsComponent } from './yearly-budget-planner-details.component';

describe('YearlyBudgetPlannerDetailsComponent', () => {
  let component: YearlyBudgetPlannerDetailsComponent;
  let fixture: ComponentFixture<YearlyBudgetPlannerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyBudgetPlannerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyBudgetPlannerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
