import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoneIssueComponent } from './stone-issue.component';

describe('StoneIssueComponent', () => {
  let component: StoneIssueComponent;
  let fixture: ComponentFixture<StoneIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoneIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoneIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
