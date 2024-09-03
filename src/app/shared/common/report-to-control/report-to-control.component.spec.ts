import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportToControlComponent } from './report-to-control.component';

describe('ReportToControlComponent', () => {
  let component: ReportToControlComponent;
  let fixture: ComponentFixture<ReportToControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportToControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportToControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
