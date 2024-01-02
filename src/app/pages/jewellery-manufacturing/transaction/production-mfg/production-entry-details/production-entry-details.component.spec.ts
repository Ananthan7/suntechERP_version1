import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionEntryDetailsComponent } from './production-entry-details.component';

describe('ProductionEntryDetailsComponent', () => {
  let component: ProductionEntryDetailsComponent;
  let fixture: ComponentFixture<ProductionEntryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionEntryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionEntryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
