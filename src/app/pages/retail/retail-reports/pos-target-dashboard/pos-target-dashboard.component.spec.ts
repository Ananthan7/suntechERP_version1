import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosTargetDashboardComponent } from './pos-target-dashboard.component';

describe('PosTargetDashboardComponent', () => {
  let component: PosTargetDashboardComponent;
  let fixture: ComponentFixture<PosTargetDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosTargetDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosTargetDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
