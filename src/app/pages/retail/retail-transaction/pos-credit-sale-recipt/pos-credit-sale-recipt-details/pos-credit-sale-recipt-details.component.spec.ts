import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCreditSaleReciptDetailsComponent } from './pos-credit-sale-recipt-details.component';

describe('PosCreditSaleReciptDetailsComponent', () => {
  let component: PosCreditSaleReciptDetailsComponent;
  let fixture: ComponentFixture<PosCreditSaleReciptDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosCreditSaleReciptDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosCreditSaleReciptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
