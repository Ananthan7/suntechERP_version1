import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDiaDetailGstComponent } from './sales-dia-detail-gst.component';

describe('SalesDiaDetailGstComponent', () => {
  let component: SalesDiaDetailGstComponent;
  let fixture: ComponentFixture<SalesDiaDetailGstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesDiaDetailGstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDiaDetailGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
