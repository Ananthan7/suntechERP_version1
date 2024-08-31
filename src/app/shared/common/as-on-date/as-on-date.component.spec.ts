import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsOnDateComponent } from './as-on-date.component';

describe('AsOnDateComponent', () => {
  let component: AsOnDateComponent;
  let fixture: ComponentFixture<AsOnDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsOnDateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsOnDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
