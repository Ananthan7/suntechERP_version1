import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionMfgComponent } from './production-mfg.component';

describe('ProductionMfgComponent', () => {
  let component: ProductionMfgComponent;
  let fixture: ComponentFixture<ProductionMfgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionMfgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionMfgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
