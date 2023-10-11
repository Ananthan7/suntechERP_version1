import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTransferDetailsComponent } from './process-transfer-details.component';

describe('ProcessTransferDetailsComponent', () => {
  let component: ProcessTransferDetailsComponent;
  let fixture: ComponentFixture<ProcessTransferDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessTransferDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTransferDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
