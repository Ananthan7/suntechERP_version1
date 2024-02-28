import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalBranchTransferInAutoRepairComponent } from './metal-branch-transfer-in-auto-repair.component';

describe('MetalBranchTransferInAutoRepairComponent', () => {
  let component: MetalBranchTransferInAutoRepairComponent;
  let fixture: ComponentFixture<MetalBranchTransferInAutoRepairComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetalBranchTransferInAutoRepairComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalBranchTransferInAutoRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
