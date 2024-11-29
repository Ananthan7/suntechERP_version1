import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftVoucherDetailMasterComponent } from './gift-voucher-detail-master.component';

describe('GiftVoucherDetailMasterComponent', () => {
  let component: GiftVoucherDetailMasterComponent;
  let fixture: ComponentFixture<GiftVoucherDetailMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftVoucherDetailMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftVoucherDetailMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
