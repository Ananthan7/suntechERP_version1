import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosReturnComponent } from './pos-return.component';

describe('PosReturnComponent', () => {
  let component: PosReturnComponent;
  let fixture: ComponentFixture<PosReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
