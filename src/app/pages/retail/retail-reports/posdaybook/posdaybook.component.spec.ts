import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSDaybookComponent } from './posdaybook.component';

describe('POSDaybookComponent', () => {
  let component: POSDaybookComponent;
  let fixture: ComponentFixture<POSDaybookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POSDaybookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POSDaybookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
