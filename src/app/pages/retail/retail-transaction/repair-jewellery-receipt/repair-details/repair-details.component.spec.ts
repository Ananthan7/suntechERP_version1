import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairDetailsComponent } from './repair-details.component';

describe('RepairDetailsComponent', () => {
  let component: RepairDetailsComponent;
  let fixture: ComponentFixture<RepairDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
