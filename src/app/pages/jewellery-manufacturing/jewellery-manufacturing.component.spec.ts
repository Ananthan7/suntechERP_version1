import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryManufacturingComponent } from './jewellery-manufacturing.component';

describe('JewelleryManufacturingComponent', () => {
  let component: JewelleryManufacturingComponent;
  let fixture: ComponentFixture<JewelleryManufacturingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryManufacturingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryManufacturingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
