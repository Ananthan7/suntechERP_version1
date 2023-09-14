import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CADProcessingComponent } from './cad-processing.component';

describe('CADProcessingComponent', () => {
  let component: CADProcessingComponent;
  let fixture: ComponentFixture<CADProcessingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CADProcessingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CADProcessingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
