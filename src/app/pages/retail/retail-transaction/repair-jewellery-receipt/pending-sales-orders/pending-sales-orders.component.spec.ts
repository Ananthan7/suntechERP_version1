import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingSalesOrdersComponent } from './pending-sales-orders.component';

describe('PendingSalesOrdersComponent', () => {
  let component: PendingSalesOrdersComponent;
  let fixture: ComponentFixture<PendingSalesOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PendingSalesOrdersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingSalesOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
