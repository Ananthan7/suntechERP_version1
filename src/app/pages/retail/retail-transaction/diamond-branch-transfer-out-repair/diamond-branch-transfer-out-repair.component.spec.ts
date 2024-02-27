import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamondBranchTransferOutRepairComponent } from './diamond-branch-transfer-out-repair.component';

describe('DiamondBranchTransferOutRepairComponent', () => {
  let component: DiamondBranchTransferOutRepairComponent;
  let fixture: ComponentFixture<DiamondBranchTransferOutRepairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiamondBranchTransferOutRepairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiamondBranchTransferOutRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
