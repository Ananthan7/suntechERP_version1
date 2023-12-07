import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosPurchaseDirectComponent } from './pos-purchase-direct.component';

describe('PosPurchaseDirectComponent', () => {
  let component: PosPurchaseDirectComponent;
  let fixture: ComponentFixture<PosPurchaseDirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosPurchaseDirectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosPurchaseDirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
