import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchTransferRepairRtnComponent } from './branch-transfer-repair-rtn.component';

describe('BranchTransferRepairRtnComponent', () => {
  let component: BranchTransferRepairRtnComponent;
  let fixture: ComponentFixture<BranchTransferRepairRtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchTransferRepairRtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchTransferRepairRtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
