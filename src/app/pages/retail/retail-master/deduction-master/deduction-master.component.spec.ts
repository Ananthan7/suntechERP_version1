import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeductionMasterComponent } from './deduction-master.component';

describe('DeductionMasterComponent', () => {
  let component: DeductionMasterComponent;
  let fixture: ComponentFixture<DeductionMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeductionMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeductionMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
