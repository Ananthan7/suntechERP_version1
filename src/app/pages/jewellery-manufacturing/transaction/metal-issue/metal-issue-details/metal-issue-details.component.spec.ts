import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalIssueDetailsComponent } from './metal-issue-details.component';

describe('MetalIssueDetailsComponent', () => {
  let component: MetalIssueDetailsComponent;
  let fixture: ComponentFixture<MetalIssueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetalIssueDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalIssueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
