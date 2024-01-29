import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailGridComponent } from './retail-grid.component';

describe('RetailGridComponent', () => {
  let component: RetailGridComponent;
  let fixture: ComponentFixture<RetailGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
