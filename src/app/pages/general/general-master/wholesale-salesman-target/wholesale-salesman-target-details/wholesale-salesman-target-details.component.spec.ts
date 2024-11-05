import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WholesaleSalesmanTargetDetailsComponent } from './wholesale-salesman-target-details.component';

describe('WholesaleSalesmanTargetDetailsComponent', () => {
  let component: WholesaleSalesmanTargetDetailsComponent;
  let fixture: ComponentFixture<WholesaleSalesmanTargetDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WholesaleSalesmanTargetDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WholesaleSalesmanTargetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
