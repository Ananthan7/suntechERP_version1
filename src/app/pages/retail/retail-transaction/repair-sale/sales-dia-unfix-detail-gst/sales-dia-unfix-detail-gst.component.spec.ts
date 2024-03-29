import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDiaUnfixDetailGstComponent } from './sales-dia-unfix-detail-gst.component';

describe('SalesDiaUnfixDetailGstComponent', () => {
  let component: SalesDiaUnfixDetailGstComponent;
  let fixture: ComponentFixture<SalesDiaUnfixDetailGstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesDiaUnfixDetailGstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDiaUnfixDetailGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
