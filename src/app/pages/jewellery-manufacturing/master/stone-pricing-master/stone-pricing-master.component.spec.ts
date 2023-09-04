import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StonePricingMasterComponent } from './stone-pricing-master.component';

describe('StonePricingMasterComponent', () => {
  let component: StonePricingMasterComponent;
  let fixture: ComponentFixture<StonePricingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StonePricingMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StonePricingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
