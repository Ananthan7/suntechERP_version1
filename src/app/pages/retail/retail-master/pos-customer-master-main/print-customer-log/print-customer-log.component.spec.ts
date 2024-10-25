import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintCustomerLogComponent } from './print-customer-log.component';

describe('PrintCustomerLogComponent', () => {
  let component: PrintCustomerLogComponent;
  let fixture: ComponentFixture<PrintCustomerLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintCustomerLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintCustomerLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
