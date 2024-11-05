import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllowanceMasterComponent } from './allowance-master.component';

describe('AllowanceMasterComponent', () => {
  let component: AllowanceMasterComponent;
  let fixture: ComponentFixture<AllowanceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllowanceMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllowanceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
