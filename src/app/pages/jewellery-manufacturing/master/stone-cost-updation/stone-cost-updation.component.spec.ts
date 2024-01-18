import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoneCostUpdationComponent } from './stone-cost-updation.component';

describe('StoneCostUpdationComponent', () => {
  let component: StoneCostUpdationComponent;
  let fixture: ComponentFixture<StoneCostUpdationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoneCostUpdationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoneCostUpdationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
