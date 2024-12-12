import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactMasterComponent } from './contact-master.component';

describe('ContactMasterComponent', () => {
  let component: ContactMasterComponent;
  let fixture: ComponentFixture<ContactMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
