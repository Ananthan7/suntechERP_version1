import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalBranchTransferOutRepairComponent } from './metal-branch-transfer-out-repair.component';

describe('MetalBranchTransferOutRepairComponent', () => {
  let component: MetalBranchTransferOutRepairComponent;
  let fixture: ComponentFixture<MetalBranchTransferOutRepairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetalBranchTransferOutRepairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalBranchTransferOutRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
