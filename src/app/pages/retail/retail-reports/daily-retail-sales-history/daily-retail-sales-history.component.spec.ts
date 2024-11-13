import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRetailSalesHistoryComponent } from './daily-retail-sales-history.component';

describe('DailyRetailSalesHistoryComponent', () => {
  let component: DailyRetailSalesHistoryComponent;
  let fixture: ComponentFixture<DailyRetailSalesHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyRetailSalesHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyRetailSalesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
