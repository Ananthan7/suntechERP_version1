import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceReturnComponent } from './advance-return.component';

describe('AdvanceReturnComponent', () => {
  let component: AdvanceReturnComponent;
  let fixture: ComponentFixture<AdvanceReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
