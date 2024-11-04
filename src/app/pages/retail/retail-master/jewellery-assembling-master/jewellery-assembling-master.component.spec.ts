import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryAssemblingMasterComponent } from './jewellery-assembling-master.component';

describe('JewelleryAssemblingMasterComponent', () => {
  let component: JewelleryAssemblingMasterComponent;
  let fixture: ComponentFixture<JewelleryAssemblingMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryAssemblingMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryAssemblingMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
