import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailKaratRateLogComponent } from './retail-karat-rate-log.component';

describe('RetailKaratRateLogComponent', () => {
  let component: RetailKaratRateLogComponent;
  let fixture: ComponentFixture<RetailKaratRateLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailKaratRateLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailKaratRateLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
