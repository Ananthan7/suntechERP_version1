import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerMasterComponent } from './worker-master.component';

describe('WorkerMasterComponent', () => {
  let component: WorkerMasterComponent;
  let fixture: ComponentFixture<WorkerMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkerMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
