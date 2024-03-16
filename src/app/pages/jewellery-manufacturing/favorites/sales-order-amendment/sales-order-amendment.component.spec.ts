import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderAmendmentComponent } from './sales-order-amendment.component';

describe('SalesOrderAmendmentComponent', () => {
  let component: SalesOrderAmendmentComponent;
  let fixture: ComponentFixture<SalesOrderAmendmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderAmendmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesOrderAmendmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
