import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCustomerMasterComponent } from './pos-customer-master.component';

describe('PosCustomerMasterComponent', () => {
  let component: PosCustomerMasterComponent;
  let fixture: ComponentFixture<PosCustomerMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosCustomerMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosCustomerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
