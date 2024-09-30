import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderRegisterComponent } from './sales-order-register.component';

describe('SalesOrderRegisterComponent', () => {
  let component: SalesOrderRegisterComponent;
  let fixture: ComponentFixture<SalesOrderRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
