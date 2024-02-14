import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCustomerFeedbackFollowupComponent } from './pos-customer-feedback-followup.component';

describe('PosCustomerFeedbackFollowupComponent', () => {
  let component: PosCustomerFeedbackFollowupComponent;
  let fixture: ComponentFixture<PosCustomerFeedbackFollowupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosCustomerFeedbackFollowupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosCustomerFeedbackFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
