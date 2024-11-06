import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubLedgerMasterComponent } from './sub-ledger-master.component';

describe('SubLedgerMasterComponent', () => {
  let component: SubLedgerMasterComponent;
  let fixture: ComponentFixture<SubLedgerMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubLedgerMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubLedgerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
