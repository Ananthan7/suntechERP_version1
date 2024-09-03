import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyRegisterComponent } from './loyalty-register.component';

describe('LoyaltyRegisterComponent', () => {
  let component: LoyaltyRegisterComponent;
  let fixture: ComponentFixture<LoyaltyRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoyaltyRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
