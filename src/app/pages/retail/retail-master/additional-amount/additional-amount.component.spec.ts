import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalAmountComponent } from './additional-amount.component';

describe('AdditionalAmountComponent', () => {
  let component: AdditionalAmountComponent;
  let fixture: ComponentFixture<AdditionalAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
