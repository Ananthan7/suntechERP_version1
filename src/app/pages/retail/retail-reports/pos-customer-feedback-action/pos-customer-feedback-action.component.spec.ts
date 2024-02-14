import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCustomerFeedbackActionComponent } from './pos-customer-feedback-action.component';

describe('PosCustomerFeedbackActionComponent', () => {
  let component: PosCustomerFeedbackActionComponent;
  let fixture: ComponentFixture<PosCustomerFeedbackActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosCustomerFeedbackActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosCustomerFeedbackActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
