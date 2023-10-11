import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationProcessComponent } from './quotation-process.component';

describe('QuotationProcessComponent', () => {
  let component: QuotationProcessComponent;
  let fixture: ComponentFixture<QuotationProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuotationProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
