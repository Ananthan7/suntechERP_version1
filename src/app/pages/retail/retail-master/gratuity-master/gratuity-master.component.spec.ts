import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GratuityMasterComponent } from './gratuity-master.component';

describe('GratuityMasterComponent', () => {
  let component: GratuityMasterComponent;
  let fixture: ComponentFixture<GratuityMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GratuityMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GratuityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
