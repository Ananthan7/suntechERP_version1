import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportScreenButtonsComponent } from './report-screen-buttons.component';

describe('ReportScreenButtonsComponent', () => {
  let component: ReportScreenButtonsComponent;
  let fixture: ComponentFixture<ReportScreenButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportScreenButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportScreenButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
