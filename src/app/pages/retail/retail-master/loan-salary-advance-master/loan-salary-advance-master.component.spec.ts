import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSalaryAdvanceMasterComponent } from './loan-salary-advance-master.component';

describe('LoanSalaryAdvanceMasterComponent', () => {
  let component: LoanSalaryAdvanceMasterComponent;
  let fixture: ComponentFixture<LoanSalaryAdvanceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanSalaryAdvanceMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanSalaryAdvanceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
