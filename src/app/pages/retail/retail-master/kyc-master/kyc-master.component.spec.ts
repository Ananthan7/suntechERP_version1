import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycMasterComponent } from './kyc-master.component';

describe('KycMasterComponent', () => {
  let component: KycMasterComponent;
  let fixture: ComponentFixture<KycMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KycMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KycMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
