import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLockUnlockComponent } from './order-lock-unlock.component';

describe('OrderLockUnlockComponent', () => {
  let component: OrderLockUnlockComponent;
  let fixture: ComponentFixture<OrderLockUnlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderLockUnlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderLockUnlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
