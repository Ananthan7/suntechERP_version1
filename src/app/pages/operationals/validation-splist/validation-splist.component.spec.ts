import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationSplistComponent } from './validation-splist.component';

describe('ValidationSplistComponent', () => {
  let component: ValidationSplistComponent;
  let fixture: ComponentFixture<ValidationSplistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidationSplistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidationSplistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
