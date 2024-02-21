import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchTransferRepairOutComponent } from './branch-transfer-repair-out.component';

describe('BranchTransferRepairOutComponent', () => {
  let component: BranchTransferRepairOutComponent;
  let fixture: ComponentFixture<BranchTransferRepairOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchTransferRepairOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchTransferRepairOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
