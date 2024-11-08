import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveSalaryMasterComponent } from './leave-salary-master.component';

describe('LeaveSalaryMasterComponent', () => {
  let component: LeaveSalaryMasterComponent;
  let fixture: ComponentFixture<LeaveSalaryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaveSalaryMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaveSalaryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
