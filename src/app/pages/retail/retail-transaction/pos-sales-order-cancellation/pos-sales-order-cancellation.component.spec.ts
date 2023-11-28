import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSalesOrderCancellationComponent } from './pos-sales-order-cancellation.component';

describe('PosSalesOrderCancellationComponent', () => {
  let component: PosSalesOrderCancellationComponent;
  let fixture: ComponentFixture<PosSalesOrderCancellationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosSalesOrderCancellationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSalesOrderCancellationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
