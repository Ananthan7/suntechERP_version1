import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamondBranchTransferInAutoRepairDetailsComponent } from './diamond-branch-transfer-in-auto-repair-details.component';

describe('DiamondBranchTransferInAutoRepairDetailsComponent', () => {
  let component: DiamondBranchTransferInAutoRepairDetailsComponent;
  let fixture: ComponentFixture<DiamondBranchTransferInAutoRepairDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiamondBranchTransferInAutoRepairDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiamondBranchTransferInAutoRepairDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
