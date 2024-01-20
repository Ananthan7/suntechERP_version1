import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTransferNewComponent } from './process-transfer-new.component';

describe('ProcessTransferNewComponent', () => {
  let component: ProcessTransferNewComponent;
  let fixture: ComponentFixture<ProcessTransferNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessTransferNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTransferNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
