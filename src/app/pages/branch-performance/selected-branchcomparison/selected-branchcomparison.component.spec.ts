import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedBranchcomparisonComponent } from './selected-branchcomparison.component';

describe('SelectedBranchcomparisonComponent', () => {
  let component: SelectedBranchcomparisonComponent;
  let fixture: ComponentFixture<SelectedBranchcomparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedBranchcomparisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedBranchcomparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
