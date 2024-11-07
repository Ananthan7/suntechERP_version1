import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDocumentMasterComponent } from './general-document-master.component';

describe('GeneralDocumentMasterComponent', () => {
  let component: GeneralDocumentMasterComponent;
  let fixture: ComponentFixture<GeneralDocumentMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralDocumentMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDocumentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
