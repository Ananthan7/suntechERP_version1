import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewdiamondquotationComponent } from './add-newdiamondquotation.component';

describe('AddNewdiamondquotationComponent', () => {
  let component: AddNewdiamondquotationComponent;
  let fixture: ComponentFixture<AddNewdiamondquotationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewdiamondquotationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewdiamondquotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
