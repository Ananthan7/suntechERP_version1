import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VatMasterComponent } from './vat-master.component';

describe('VatMasterComponent', () => {
  let component: VatMasterComponent;
  let fixture: ComponentFixture<VatMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VatMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VatMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
