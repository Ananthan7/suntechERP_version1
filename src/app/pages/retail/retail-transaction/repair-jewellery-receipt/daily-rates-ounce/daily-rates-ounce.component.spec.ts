import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyRatesOunceComponent } from './daily-rates-ounce.component';

describe('DailyRatesOunceComponent', () => {
  let component: DailyRatesOunceComponent;
  let fixture: ComponentFixture<DailyRatesOunceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyRatesOunceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyRatesOunceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
