import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryAssemblingStonesDetailsComponent } from './jewellery-assembling-stones-details.component';

describe('JewelleryAssemblingStonesDetailsComponent', () => {
  let component: JewelleryAssemblingStonesDetailsComponent;
  let fixture: ComponentFixture<JewelleryAssemblingStonesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryAssemblingStonesDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryAssemblingStonesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
