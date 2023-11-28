import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterStoneDetailsComponent } from './enter-stone-details.component';

describe('EnterStoneDetailsComponent', () => {
  let component: EnterStoneDetailsComponent;
  let fixture: ComponentFixture<EnterStoneDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnterStoneDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterStoneDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
