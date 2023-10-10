import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalReturnComponent } from './metal-return.component';

describe('MetalReturnComponent', () => {
  let component: MetalReturnComponent;
  let fixture: ComponentFixture<MetalReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetalReturnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
