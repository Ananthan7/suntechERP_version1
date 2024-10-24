import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTransDetailsComponent } from './show-trans-details.component';

describe('ShowTransDetailsComponent', () => {
  let component: ShowTransDetailsComponent;
  let fixture: ComponentFixture<ShowTransDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowTransDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTransDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
