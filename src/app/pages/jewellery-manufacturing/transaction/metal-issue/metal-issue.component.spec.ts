import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalIssueComponent } from './metal-issue.component';

describe('MetalIssueComponent', () => {
  let component: MetalIssueComponent;
  let fixture: ComponentFixture<MetalIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetalIssueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
