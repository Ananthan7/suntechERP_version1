import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlloyAllocationComponent } from './alloy-allocation.component';

describe('AlloyAllocationComponent', () => {
  let component: AlloyAllocationComponent;
  let fixture: ComponentFixture<AlloyAllocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlloyAllocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlloyAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
