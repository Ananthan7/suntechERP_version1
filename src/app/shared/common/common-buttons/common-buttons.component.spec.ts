import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonButtonsComponent } from './common-buttons.component';

describe('CommonButtonsComponent', () => {
  let component: CommonButtonsComponent;
  let fixture: ComponentFixture<CommonButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
