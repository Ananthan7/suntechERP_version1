import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PcrSelectionComponent } from './pcr-selection.component';

describe('PcrSelectionComponent', () => {
  let component: PcrSelectionComponent;
  let fixture: ComponentFixture<PcrSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PcrSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PcrSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
