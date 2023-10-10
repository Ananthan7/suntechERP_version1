import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryAltrationDetailsComponent } from './jewellery-altration-details.component';

describe('JewelleryAltrationDetailsComponent', () => {
  let component: JewelleryAltrationDetailsComponent;
  let fixture: ComponentFixture<JewelleryAltrationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryAltrationDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryAltrationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
