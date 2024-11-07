import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSalespersonTargetComponent } from './pos-salesperson-target.component';

describe('PosSalespersonTargetComponent', () => {
  let component: PosSalespersonTargetComponent;
  let fixture: ComponentFixture<PosSalespersonTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosSalespersonTargetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSalespersonTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
