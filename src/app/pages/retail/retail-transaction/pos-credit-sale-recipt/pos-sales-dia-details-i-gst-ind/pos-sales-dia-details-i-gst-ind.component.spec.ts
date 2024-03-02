import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSalesDiaDetailsIGSTIndComponent } from './pos-sales-dia-details-i-gst-ind.component';

describe('PosSalesDiaDetailsIGSTIndComponent', () => {
  let component: PosSalesDiaDetailsIGSTIndComponent;
  let fixture: ComponentFixture<PosSalesDiaDetailsIGSTIndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosSalesDiaDetailsIGSTIndComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSalesDiaDetailsIGSTIndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
