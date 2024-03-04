import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullPOSComponent } from './pull-pos.component';

describe('PullPOSComponent', () => {
  let component: PullPOSComponent;
  let fixture: ComponentFixture<PullPOSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PullPOSComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PullPOSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
