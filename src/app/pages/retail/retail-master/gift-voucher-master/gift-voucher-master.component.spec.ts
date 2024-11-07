import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftVoucherMasterComponent } from './gift-voucher-master.component';

describe('GiftVoucherMasterComponent', () => {
  let component: GiftVoucherMasterComponent;
  let fixture: ComponentFixture<GiftVoucherMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GiftVoucherMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftVoucherMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
