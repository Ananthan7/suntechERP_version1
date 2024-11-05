import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryBrandingComponent } from './jewellery-branding.component';

describe('JewelleryBrandingComponent', () => {
  let component: JewelleryBrandingComponent;
  let fixture: ComponentFixture<JewelleryBrandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryBrandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryBrandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
