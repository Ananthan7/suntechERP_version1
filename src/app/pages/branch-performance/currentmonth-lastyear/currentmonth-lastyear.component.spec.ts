import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentmonthLastyearComponent } from './currentmonth-lastyear.component';

describe('CurrentmonthLastyearComponent', () => {
  let component: CurrentmonthLastyearComponent;
  let fixture: ComponentFixture<CurrentmonthLastyearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentmonthLastyearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentmonthLastyearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
