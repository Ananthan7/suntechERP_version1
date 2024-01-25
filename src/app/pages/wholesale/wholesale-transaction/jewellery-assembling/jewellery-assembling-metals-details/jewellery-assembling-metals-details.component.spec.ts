import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryAssemblingMetalsDetailsComponent } from './jewellery-assembling-metals-details.component';

describe('JewelleryAssemblingMetalsDetailsComponent', () => {
  let component: JewelleryAssemblingMetalsDetailsComponent;
  let fixture: ComponentFixture<JewelleryAssemblingMetalsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryAssemblingMetalsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryAssemblingMetalsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
