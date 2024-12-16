import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GpcGridComponentComponent } from './gpc-grid-component.component';

describe('GpcGridComponentComponent', () => {
  let component: GpcGridComponentComponent;
  let fixture: ComponentFixture<GpcGridComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GpcGridComponentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GpcGridComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
