import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTransferComponent } from './process-transfer.component';

describe('ProcessTransferComponent', () => {
  let component: ProcessTransferComponent;
  let fixture: ComponentFixture<ProcessTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessTransferComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
