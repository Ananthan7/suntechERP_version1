import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobStickerPrintComponent } from './job-sticker-print.component';

describe('JobStickerPrintComponent', () => {
  let component: JobStickerPrintComponent;
  let fixture: ComponentFixture<JobStickerPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JobStickerPrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobStickerPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
