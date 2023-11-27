import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterMetalDetailsComponent } from './enter-metal-details.component';

describe('EnterMetalDetailsComponent', () => {
  let component: EnterMetalDetailsComponent;
  let fixture: ComponentFixture<EnterMetalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterMetalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterMetalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
