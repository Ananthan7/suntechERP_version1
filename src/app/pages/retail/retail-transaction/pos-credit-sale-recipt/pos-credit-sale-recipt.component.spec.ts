import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCreditSaleReciptComponent } from './pos-credit-sale-recipt.component';

describe('PosCreditSaleReciptComponent', () => {
  let component: PosCreditSaleReciptComponent;
  let fixture: ComponentFixture<PosCreditSaleReciptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosCreditSaleReciptComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosCreditSaleReciptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
