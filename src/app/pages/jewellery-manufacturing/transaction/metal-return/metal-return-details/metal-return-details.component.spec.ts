import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalReturnDetailsComponent } from './metal-return-details.component';

describe('MetalReturnDetailsComponent', () => {
  let component: MetalReturnDetailsComponent;
  let fixture: ComponentFixture<MetalReturnDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetalReturnDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalReturnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
