import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZirconMasterComponent } from './zircon-master.component';

describe('ZirconMasterComponent', () => {
  let component: ZirconMasterComponent;
  let fixture: ComponentFixture<ZirconMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZirconMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZirconMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
