import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamondBranchTransferInAutoRepairComponent } from './diamond-branch-transfer-in-auto-repair.component';

describe('DiamondBranchTransferInAutoRepairComponent', () => {
  let component: DiamondBranchTransferInAutoRepairComponent;
  let fixture: ComponentFixture<DiamondBranchTransferInAutoRepairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiamondBranchTransferInAutoRepairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiamondBranchTransferInAutoRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
