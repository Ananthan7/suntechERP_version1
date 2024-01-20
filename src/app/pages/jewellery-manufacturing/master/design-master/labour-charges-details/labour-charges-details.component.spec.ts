import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabourChargesDetailsComponent } from './labour-charges-details.component';

describe('LabourChargesDetailsComponent', () => {
  let component: LabourChargesDetailsComponent;
  let fixture: ComponentFixture<LabourChargesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LabourChargesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LabourChargesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
