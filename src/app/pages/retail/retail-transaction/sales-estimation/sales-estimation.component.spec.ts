import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesEstimationComponent } from './sales-estimation.component';

describe('SalesEstimationComponent', () => {
  let component: SalesEstimationComponent;
  let fixture: ComponentFixture<SalesEstimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesEstimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesEstimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
