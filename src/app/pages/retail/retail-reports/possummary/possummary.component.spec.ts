import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POSSummaryComponent } from './possummary.component';

describe('POSSummaryComponent', () => {
  let component: POSSummaryComponent;
  let fixture: ComponentFixture<POSSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ POSSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(POSSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
