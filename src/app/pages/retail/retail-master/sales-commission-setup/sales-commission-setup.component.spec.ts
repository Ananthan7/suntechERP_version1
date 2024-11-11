import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCommissionSetupComponent } from './sales-commission-setup.component';

describe('SalesCommissionSetupComponent', () => {
  let component: SalesCommissionSetupComponent;
  let fixture: ComponentFixture<SalesCommissionSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesCommissionSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCommissionSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
