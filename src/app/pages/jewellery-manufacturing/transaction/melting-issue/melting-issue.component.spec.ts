import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeltingIssueComponent } from './melting-issue.component';

describe('MeltingIssueComponent', () => {
  let component: MeltingIssueComponent;
  let fixture: ComponentFixture<MeltingIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeltingIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeltingIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
