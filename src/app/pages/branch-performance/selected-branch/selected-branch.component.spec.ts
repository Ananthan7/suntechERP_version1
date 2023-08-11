import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedBranchComponent } from './selected-branch.component';

describe('SelectedBranchComponent', () => {
  let component: SelectedBranchComponent;
  let fixture: ComponentFixture<SelectedBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
