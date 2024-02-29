import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamonBranchTransferOutDetailsComponent } from './diamon-branch-transfer-out-details.component';

describe('DiamonBranchTransferOutDetailsComponent', () => {
  let component: DiamonBranchTransferOutDetailsComponent;
  let fixture: ComponentFixture<DiamonBranchTransferOutDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiamonBranchTransferOutDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiamonBranchTransferOutDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
