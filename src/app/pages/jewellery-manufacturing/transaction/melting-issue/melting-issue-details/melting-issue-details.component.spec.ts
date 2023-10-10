import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeltingIssueDetailsComponent } from './melting-issue-details.component';

describe('MeltingIssueDetailsComponent', () => {
  let component: MeltingIssueDetailsComponent;
  let fixture: ComponentFixture<MeltingIssueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeltingIssueDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeltingIssueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
