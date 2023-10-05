import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoneIssueDetailComponent } from './stone-issue-detail.component';

describe('StoneIssueDetailComponent', () => {
  let component: StoneIssueDetailComponent;
  let fixture: ComponentFixture<StoneIssueDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoneIssueDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoneIssueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
