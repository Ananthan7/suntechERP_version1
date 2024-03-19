import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducationLossRecoveryComponent } from './producation-loss-recovery.component';

describe('ProducationLossRecoveryComponent', () => {
  let component: ProducationLossRecoveryComponent;
  let fixture: ComponentFixture<ProducationLossRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProducationLossRecoveryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducationLossRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
