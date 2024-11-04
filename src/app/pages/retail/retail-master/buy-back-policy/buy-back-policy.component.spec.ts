import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyBackPolicyComponent } from './buy-back-policy.component';

describe('BuyBackPolicyComponent', () => {
  let component: BuyBackPolicyComponent;
  let fixture: ComponentFixture<BuyBackPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyBackPolicyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyBackPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
