import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetRefMasterComponent } from './set-ref-master.component';

describe('SetRefMasterComponent', () => {
  let component: SetRefMasterComponent;
  let fixture: ComponentFixture<SetRefMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetRefMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetRefMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
