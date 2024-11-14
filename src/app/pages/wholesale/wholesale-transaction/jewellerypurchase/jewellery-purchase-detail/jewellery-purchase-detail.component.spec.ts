import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryPurchaseDetailComponent } from './jewellery-purchase-detail.component';

describe('JewelleryPurchaseDetailComponent', () => {
  let component: JewelleryPurchaseDetailComponent;
  let fixture: ComponentFixture<JewelleryPurchaseDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryPurchaseDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryPurchaseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
