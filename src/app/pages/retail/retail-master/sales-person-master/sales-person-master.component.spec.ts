import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPersonMasterComponent } from './sales-person-master.component';

describe('SalesPersonMasterComponent', () => {
  let component: SalesPersonMasterComponent;
  let fixture: ComponentFixture<SalesPersonMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesPersonMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesPersonMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
