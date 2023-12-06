import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointOfSalesOrderComponent } from './point-of-sales-order.component';

describe('PointOfSalesOrderComponent', () => {
  let component: PointOfSalesOrderComponent;
  let fixture: ComponentFixture<PointOfSalesOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointOfSalesOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointOfSalesOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
