import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptModesComponent } from './receipt-modes.component';

describe('ReceiptModesComponent', () => {
  let component: ReceiptModesComponent;
  let fixture: ComponentFixture<ReceiptModesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptModesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
