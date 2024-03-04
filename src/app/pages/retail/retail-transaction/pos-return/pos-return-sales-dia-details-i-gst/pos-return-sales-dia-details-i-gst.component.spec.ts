import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosReturnSalesDiaDetailsIGSTComponent } from './pos-return-sales-dia-details-i-gst.component';

describe('PosReturnSalesDiaDetailsIGSTComponent', () => {
  let component: PosReturnSalesDiaDetailsIGSTComponent;
  let fixture: ComponentFixture<PosReturnSalesDiaDetailsIGSTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosReturnSalesDiaDetailsIGSTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosReturnSalesDiaDetailsIGSTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
