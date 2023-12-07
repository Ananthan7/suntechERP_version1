import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointOfSalesOrderDetailsComponent } from './point-of-sales-order-details.component';

describe('PointOfSalesOrderDetailsComponent', () => {
  let component: PointOfSalesOrderDetailsComponent;
  let fixture: ComponentFixture<PointOfSalesOrderDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointOfSalesOrderDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointOfSalesOrderDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
