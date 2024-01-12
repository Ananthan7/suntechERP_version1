import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamondJobBoqIssueComponent } from './diamond-job-boq-issue.component';

describe('DiamondJobBoqIssueComponent', () => {
  let component: DiamondJobBoqIssueComponent;
  let fixture: ComponentFixture<DiamondJobBoqIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiamondJobBoqIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiamondJobBoqIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
