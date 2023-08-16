import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailMasterComponent } from './retail-master.component';

describe('RetailMasterComponent', () => {
  let component: RetailMasterComponent;
  let fixture: ComponentFixture<RetailMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetailMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
