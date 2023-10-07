import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaxProcessReturnComponent } from './wax-process-return.component';

describe('WaxProcessReturnComponent', () => {
  let component: WaxProcessReturnComponent;
  let fixture: ComponentFixture<WaxProcessReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaxProcessReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaxProcessReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
