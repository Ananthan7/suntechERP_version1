import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryAssemblingMetalDetailsComponent } from './jewellery-assembling-metal-details.component';

describe('JewelleryAssemblingMetalDetailsComponent', () => {
  let component: JewelleryAssemblingMetalDetailsComponent;
  let fixture: ComponentFixture<JewelleryAssemblingMetalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryAssemblingMetalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryAssemblingMetalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
