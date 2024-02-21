import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairIssueFromWorkshopComponent } from './repair-issue-from-workshop.component';

describe('RepairIssueFromWorkshopComponent', () => {
  let component: RepairIssueFromWorkshopComponent;
  let fixture: ComponentFixture<RepairIssueFromWorkshopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepairIssueFromWorkshopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairIssueFromWorkshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
