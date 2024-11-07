import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyCardMasterComponent } from './loyalty-card-master.component';

describe('LoyaltyCardMasterComponent', () => {
  let component: LoyaltyCardMasterComponent;
  let fixture: ComponentFixture<LoyaltyCardMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoyaltyCardMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyCardMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
