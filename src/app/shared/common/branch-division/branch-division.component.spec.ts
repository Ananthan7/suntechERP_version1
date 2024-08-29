import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchDivisionComponent } from './branch-division.component';

describe('BranchDivisionComponent', () => {
  let component: BranchDivisionComponent;
  let fixture: ComponentFixture<BranchDivisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchDivisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchDivisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
