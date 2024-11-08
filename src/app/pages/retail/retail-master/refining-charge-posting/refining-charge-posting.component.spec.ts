import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefiningChargePostingComponent } from './refining-charge-posting.component';

describe('RefiningChargePostingComponent', () => {
  let component: RefiningChargePostingComponent;
  let fixture: ComponentFixture<RefiningChargePostingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefiningChargePostingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefiningChargePostingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
