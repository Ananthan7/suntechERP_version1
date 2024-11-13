import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewellerypurchaseComponent } from './jewellerypurchase.component';

describe('JewellerypurchaseComponent', () => {
  let component: JewellerypurchaseComponent;
  let fixture: ComponentFixture<JewellerypurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewellerypurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewellerypurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
