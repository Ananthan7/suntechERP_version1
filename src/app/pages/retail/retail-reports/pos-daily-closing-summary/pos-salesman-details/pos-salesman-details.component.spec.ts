import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosSalesmanDetailsComponent } from './pos-salesman-details.component';

describe('PosSalesmanDetailsComponent', () => {
  let component: PosSalesmanDetailsComponent;
  let fixture: ComponentFixture<PosSalesmanDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosSalesmanDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosSalesmanDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
