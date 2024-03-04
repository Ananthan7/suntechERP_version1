import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosReturnSalesDiaUnfixDetailsGSTComponent } from './pos-return-sales-dia-unfix-details-gst.component';

describe('PosReturnSalesDiaUnfixDetailsGSTComponent', () => {
  let component: PosReturnSalesDiaUnfixDetailsGSTComponent;
  let fixture: ComponentFixture<PosReturnSalesDiaUnfixDetailsGSTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosReturnSalesDiaUnfixDetailsGSTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosReturnSalesDiaUnfixDetailsGSTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
