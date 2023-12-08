import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosPurchaseDirectDetailComponent } from './pos-purchase-direct-detail.component';

describe('PosPurchaseDirectDetailComponent', () => {
  let component: PosPurchaseDirectDetailComponent;
  let fixture: ComponentFixture<PosPurchaseDirectDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosPurchaseDirectDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosPurchaseDirectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
