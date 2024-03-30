import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailRepairMenuComponent } from './retail-repair-menu.component';

describe('RetailRepairMenuComponent', () => {
  let component: RetailRepairMenuComponent;
  let fixture: ComponentFixture<RetailRepairMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailRepairMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailRepairMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
