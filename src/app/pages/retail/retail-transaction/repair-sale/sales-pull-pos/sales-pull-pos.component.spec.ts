import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPullPosComponent } from './sales-pull-pos.component';

describe('SalesPullPosComponent', () => {
  let component: SalesPullPosComponent;
  let fixture: ComponentFixture<SalesPullPosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPullPosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPullPosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
