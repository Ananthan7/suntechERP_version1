import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeRegisterComponent } from './scheme-register.component';

describe('SchemeRegisterComponent', () => {
  let component: SchemeRegisterComponent;
  let fixture: ComponentFixture<SchemeRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemeRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
