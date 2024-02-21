import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosWalkinCustomerComponent } from './pos-walkin-customer.component';

describe('PosWalkinCustomerComponent', () => {
  let component: PosWalkinCustomerComponent;
  let fixture: ComponentFixture<PosWalkinCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosWalkinCustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosWalkinCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
