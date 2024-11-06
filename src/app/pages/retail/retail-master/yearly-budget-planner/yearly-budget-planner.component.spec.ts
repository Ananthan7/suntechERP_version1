import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyBudgetPlannerComponent } from './yearly-budget-planner.component';

describe('YearlyBudgetPlannerComponent', () => {
  let component: YearlyBudgetPlannerComponent;
  let fixture: ComponentFixture<YearlyBudgetPlannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YearlyBudgetPlannerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YearlyBudgetPlannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
