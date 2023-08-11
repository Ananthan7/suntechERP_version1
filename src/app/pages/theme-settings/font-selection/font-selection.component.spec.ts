import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FontSelectionComponent } from './font-selection.component';

describe('FontSelectionComponent', () => {
  let component: FontSelectionComponent;
  let fixture: ComponentFixture<FontSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FontSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FontSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
