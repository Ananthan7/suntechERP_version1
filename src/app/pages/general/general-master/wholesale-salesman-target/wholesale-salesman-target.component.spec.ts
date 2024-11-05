import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WholesaleSalesmanTargetComponent } from './wholesale-salesman-target.component';

describe('WholesaleSalesmanTargetComponent', () => {
  let component: WholesaleSalesmanTargetComponent;
  let fixture: ComponentFixture<WholesaleSalesmanTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WholesaleSalesmanTargetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WholesaleSalesmanTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
