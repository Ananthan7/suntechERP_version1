import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricelistMasterComponent } from './pricelist-master.component';

describe('PricelistMasterComponent', () => {
  let component: PricelistMasterComponent;
  let fixture: ComponentFixture<PricelistMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PricelistMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PricelistMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
