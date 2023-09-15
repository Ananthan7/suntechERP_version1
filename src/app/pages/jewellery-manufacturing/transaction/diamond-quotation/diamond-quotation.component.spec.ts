import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamondQuotationComponent } from './diamond-quotation.component';

describe('DiamondQuotationComponent', () => {
  let component: DiamondQuotationComponent;
  let fixture: ComponentFixture<DiamondQuotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiamondQuotationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiamondQuotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
