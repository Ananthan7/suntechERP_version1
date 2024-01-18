import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessTransferAuthorisationComponent } from './process-transfer-authorisation.component';

describe('ProcessTransferAuthorisationComponent', () => {
  let component: ProcessTransferAuthorisationComponent;
  let fixture: ComponentFixture<ProcessTransferAuthorisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessTransferAuthorisationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessTransferAuthorisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
