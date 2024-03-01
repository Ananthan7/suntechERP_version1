import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSalesDiaDetailsIGSTComponent } from './pos-sales-dia-details-i-gst.component';

describe('PosSalesDiaDetailsIGSTComponent', () => {
  let component: PosSalesDiaDetailsIGSTComponent;
  let fixture: ComponentFixture<PosSalesDiaDetailsIGSTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosSalesDiaDetailsIGSTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSalesDiaDetailsIGSTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
