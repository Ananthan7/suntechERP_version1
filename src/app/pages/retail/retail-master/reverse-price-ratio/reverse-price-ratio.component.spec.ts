import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReversePriceRatioComponent } from './reverse-price-ratio.component';

describe('ReversePriceRatioComponent', () => {
  let component: ReversePriceRatioComponent;
  let fixture: ComponentFixture<ReversePriceRatioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReversePriceRatioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReversePriceRatioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
