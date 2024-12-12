import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoAdditionalAmountComponent } from './auto-additional-amount.component';

describe('AutoAdditionalAmountComponent', () => {
  let component: AutoAdditionalAmountComponent;
  let fixture: ComponentFixture<AutoAdditionalAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoAdditionalAmountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoAdditionalAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
