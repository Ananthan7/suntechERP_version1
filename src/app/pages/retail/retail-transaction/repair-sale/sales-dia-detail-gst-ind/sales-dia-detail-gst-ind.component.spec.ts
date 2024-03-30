import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesDiaDetailGstIndComponent } from './sales-dia-detail-gst-ind.component';

describe('SalesDiaDetailGstIndComponent', () => {
  let component: SalesDiaDetailGstIndComponent;
  let fixture: ComponentFixture<SalesDiaDetailGstIndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesDiaDetailGstIndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesDiaDetailGstIndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
