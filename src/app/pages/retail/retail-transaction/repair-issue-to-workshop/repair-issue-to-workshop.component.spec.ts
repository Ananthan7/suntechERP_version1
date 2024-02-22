import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairIssueToWorkshopComponent } from './repair-issue-to-workshop.component';

describe('RepairIssueToWorkshopComponent', () => {
  let component: RepairIssueToWorkshopComponent;
  let fixture: ComponentFixture<RepairIssueToWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairIssueToWorkshopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairIssueToWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
