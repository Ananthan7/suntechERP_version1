import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSSales_Stock_ComparisonComponent } from './pos-sales-stock-comparison.component';

describe('POSSalesComponent', () => {
  let component: POSSales_Stock_ComparisonComponent;
  let fixture: ComponentFixture<POSSales_Stock_ComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POSSales_Stock_ComparisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POSSales_Stock_ComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
