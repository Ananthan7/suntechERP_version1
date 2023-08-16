import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailTransactionComponent } from './retail-transaction.component';

describe('RetailTransactionComponent', () => {
  let component: RetailTransactionComponent;
  let fixture: ComponentFixture<RetailTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
