import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YtdBranchComparisonComponent } from './ytd-branch-comparison.component';

describe('YtdBranchComparisonComponent', () => {
  let component: YtdBranchComparisonComponent;
  let fixture: ComponentFixture<YtdBranchComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YtdBranchComparisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YtdBranchComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
