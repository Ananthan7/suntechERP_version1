import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleReciptDetailsComponent } from './sale-recipt-details.component';

describe('SaleReciptDetailsComponent', () => {
  let component: SaleReciptDetailsComponent;
  let fixture: ComponentFixture<SaleReciptDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleReciptDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleReciptDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
