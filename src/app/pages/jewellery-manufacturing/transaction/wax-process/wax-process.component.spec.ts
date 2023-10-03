import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaxProcessComponent } from './wax-process.component';

describe('WaxProcessComponent', () => {
  let component: WaxProcessComponent;
  let fixture: ComponentFixture<WaxProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaxProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WaxProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
