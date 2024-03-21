import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreciousStonePurchaseComponent } from './precious-stone-purchase.component';

describe('PreciousStonePurchaseComponent', () => {
  let component: PreciousStonePurchaseComponent;
  let fixture: ComponentFixture<PreciousStonePurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreciousStonePurchaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciousStonePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
