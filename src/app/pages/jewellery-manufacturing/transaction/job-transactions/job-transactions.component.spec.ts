import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTransactionsComponent } from './job-transactions.component';

describe('JobTransactionsComponent', () => {
  let component: JobTransactionsComponent;
  let fixture: ComponentFixture<JobTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
