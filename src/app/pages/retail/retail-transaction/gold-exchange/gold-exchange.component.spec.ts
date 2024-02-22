import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldExchangeComponent } from './gold-exchange.component';

describe('GoldExchangeComponent', () => {
  let component: GoldExchangeComponent;
  let fixture: ComponentFixture<GoldExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldExchangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
