import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPrintSetupComponent } from './document-print-setup.component';

describe('DocumentPrintSetupComponent', () => {
  let component: DocumentPrintSetupComponent;
  let fixture: ComponentFixture<DocumentPrintSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentPrintSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPrintSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
