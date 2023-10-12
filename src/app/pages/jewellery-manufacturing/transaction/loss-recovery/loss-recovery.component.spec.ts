import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LossRecoveryComponent } from './loss-recovery.component';

describe('LossRecoveryComponent', () => {
  let component: LossRecoveryComponent;
  let fixture: ComponentFixture<LossRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LossRecoveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LossRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
