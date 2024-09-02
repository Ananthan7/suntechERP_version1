import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailSalesCollectionComponent } from './retail-sales-collection.component';

describe('RetailSalesCollectionComponent', () => {
  let component: RetailSalesCollectionComponent;
  let fixture: ComponentFixture<RetailSalesCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailSalesCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailSalesCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
