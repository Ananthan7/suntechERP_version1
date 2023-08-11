import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaywiseBranchComparisonComponent } from './daywise-branch-comparison.component';

describe('DaywiseBranchComparisonComponent', () => {
  let component: DaywiseBranchComparisonComponent;
  let fixture: ComponentFixture<DaywiseBranchComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaywiseBranchComparisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaywiseBranchComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
