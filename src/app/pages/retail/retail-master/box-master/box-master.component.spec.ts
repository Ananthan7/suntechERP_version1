import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxMasterComponent } from './box-master.component';

describe('BoxMasterComponent', () => {
  let component: BoxMasterComponent;
  let fixture: ComponentFixture<BoxMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
