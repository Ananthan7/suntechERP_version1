import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostcentreMagkingchargesComponent } from './costcentre-magkingcharges.component';

describe('CostcentreMagkingchargesComponent', () => {
  let component: CostcentreMagkingchargesComponent;
  let fixture: ComponentFixture<CostcentreMagkingchargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostcentreMagkingchargesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostcentreMagkingchargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
