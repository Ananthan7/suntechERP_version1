import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSalesDiaUnfixDetailsGSTComponent } from './pos-sales-dia-unfix-details-gst.component';

describe('PosSalesDiaUnfixDetailsGSTComponent', () => {
  let component: PosSalesDiaUnfixDetailsGSTComponent;
  let fixture: ComponentFixture<PosSalesDiaUnfixDetailsGSTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosSalesDiaUnfixDetailsGSTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSalesDiaUnfixDetailsGSTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
