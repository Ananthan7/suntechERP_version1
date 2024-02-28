import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldExchangeDetailsComponent } from './gold-exchange-details.component';

describe('GoldExchangeDetailsComponent', () => {
  let component: GoldExchangeDetailsComponent;
  let fixture: ComponentFixture<GoldExchangeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldExchangeDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldExchangeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
