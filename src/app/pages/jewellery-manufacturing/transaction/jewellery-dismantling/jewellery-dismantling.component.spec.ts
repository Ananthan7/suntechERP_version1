import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JewelleryDismantlingComponent } from './jewellery-dismantling.component';

describe('JewelleryDismantlingComponent', () => {
  let component: JewelleryDismantlingComponent;
  let fixture: ComponentFixture<JewelleryDismantlingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JewelleryDismantlingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JewelleryDismantlingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
