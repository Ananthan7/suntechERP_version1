import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamondSalesorderComponent } from './diamond-salesorder.component';

describe('DiamondSalesorderComponent', () => {
  let component: DiamondSalesorderComponent;
  let fixture: ComponentFixture<DiamondSalesorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiamondSalesorderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiamondSalesorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
