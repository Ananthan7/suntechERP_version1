import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoneReturnComponent } from './stone-return.component';

describe('StoneReturnComponent', () => {
  let component: StoneReturnComponent;
  let fixture: ComponentFixture<StoneReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoneReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoneReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
