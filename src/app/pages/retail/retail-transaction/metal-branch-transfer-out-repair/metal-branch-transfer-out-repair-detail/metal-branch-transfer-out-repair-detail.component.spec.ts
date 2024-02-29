import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalBranchTransferOutRepairDetailComponent } from './metal-branch-transfer-out-repair-detail.component';

describe('MetalBranchTransferOutRepairDetailComponent', () => {
  let component: MetalBranchTransferOutRepairDetailComponent;
  let fixture: ComponentFixture<MetalBranchTransferOutRepairDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetalBranchTransferOutRepairDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalBranchTransferOutRepairDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
