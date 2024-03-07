import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalBranchTransferInAutoRepairDetailsComponent } from './metal-branch-transfer-in-auto-repair-details.component';

describe('MetalBranchTransferInAutoRepairDetailsComponent', () => {
  let component: MetalBranchTransferInAutoRepairDetailsComponent;
  let fixture: ComponentFixture<MetalBranchTransferInAutoRepairDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetalBranchTransferInAutoRepairDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalBranchTransferInAutoRepairDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
