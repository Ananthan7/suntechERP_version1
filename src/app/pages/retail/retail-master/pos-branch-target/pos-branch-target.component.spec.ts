import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosBranchTargetComponent } from './pos-branch-target.component';

describe('PosBranchTargetComponent', () => {
  let component: PosBranchTargetComponent;
  let fixture: ComponentFixture<PosBranchTargetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosBranchTargetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosBranchTargetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
