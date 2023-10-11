import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryAssemblingComponent } from './jewellery-assembling.component';

describe('JewelleryAssemblingComponent', () => {
  let component: JewelleryAssemblingComponent;
  let fixture: ComponentFixture<JewelleryAssemblingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryAssemblingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryAssemblingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
