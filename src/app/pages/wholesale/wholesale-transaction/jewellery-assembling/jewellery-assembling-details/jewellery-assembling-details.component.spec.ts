import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryAssemblingDetailsComponent } from './jewellery-assembling-details.component';

describe('JewelleryAssemblingDetailsComponent', () => {
  let component: JewelleryAssemblingDetailsComponent;
  let fixture: ComponentFixture<JewelleryAssemblingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryAssemblingDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryAssemblingDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
