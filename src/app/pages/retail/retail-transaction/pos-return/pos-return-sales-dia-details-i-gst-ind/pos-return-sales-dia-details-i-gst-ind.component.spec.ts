import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosReturnSalesDiaDetailsIGSTIndComponent } from './pos-return-sales-dia-details-i-gst-ind.component';

describe('PosReturnSalesDiaDetailsIGSTIndComponent', () => {
  let component: PosReturnSalesDiaDetailsIGSTIndComponent;
  let fixture: ComponentFixture<PosReturnSalesDiaDetailsIGSTIndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosReturnSalesDiaDetailsIGSTIndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosReturnSalesDiaDetailsIGSTIndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
