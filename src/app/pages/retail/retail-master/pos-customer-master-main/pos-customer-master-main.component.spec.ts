import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCustomerMasterMainComponent } from './pos-customer-master-main.component';

describe('PosCustomerMasterMainComponent', () => {
  let component: PosCustomerMasterMainComponent;
  let fixture: ComponentFixture<PosCustomerMasterMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosCustomerMasterMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosCustomerMasterMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
