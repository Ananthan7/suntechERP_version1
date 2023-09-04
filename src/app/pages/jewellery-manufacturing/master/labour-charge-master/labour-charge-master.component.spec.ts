import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabourChargeMasterComponent } from './labour-charge-master.component';

describe('LabourChargeMasterComponent', () => {
  let component: LabourChargeMasterComponent;
  let fixture: ComponentFixture<LabourChargeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabourChargeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabourChargeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
