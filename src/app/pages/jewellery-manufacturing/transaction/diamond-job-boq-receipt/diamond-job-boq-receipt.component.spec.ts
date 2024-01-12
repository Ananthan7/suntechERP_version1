import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamondJobBoqReceiptComponent } from './diamond-job-boq-receipt.component';

describe('DiamondJobBoqReceiptComponent', () => {
  let component: DiamondJobBoqReceiptComponent;
  let fixture: ComponentFixture<DiamondJobBoqReceiptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiamondJobBoqReceiptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiamondJobBoqReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
