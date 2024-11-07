import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRefMasterRealComponent } from './set-ref-master-real.component';

describe('SetRefMasterRealComponent', () => {
  let component: SetRefMasterRealComponent;
  let fixture: ComponentFixture<SetRefMasterRealComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetRefMasterRealComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetRefMasterRealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
