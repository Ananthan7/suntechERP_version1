import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryMasterComponent } from './jewellery-master.component';

describe('JewelleryMasterComponent', () => {
  let component: JewelleryMasterComponent;
  let fixture: ComponentFixture<JewelleryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
