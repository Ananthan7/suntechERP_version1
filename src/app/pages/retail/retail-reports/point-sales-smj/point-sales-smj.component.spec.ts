import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointSalesSMJComponent } from './point-sales-smj.component';

describe('PointSalesSMJComponent', () => {
  let component: PointSalesSMJComponent;
  let fixture: ComponentFixture<PointSalesSMJComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointSalesSMJComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PointSalesSMJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
