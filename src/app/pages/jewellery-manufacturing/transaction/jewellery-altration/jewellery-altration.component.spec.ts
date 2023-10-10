import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryAltrationComponent } from './jewellery-altration.component';

describe('JewelleryAltrationComponent', () => {
  let component: JewelleryAltrationComponent;
  let fixture: ComponentFixture<JewelleryAltrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryAltrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryAltrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
