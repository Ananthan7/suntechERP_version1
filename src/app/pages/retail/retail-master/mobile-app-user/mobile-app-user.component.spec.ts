import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAppUserComponent } from './mobile-app-user.component';

describe('MobileAppUserComponent', () => {
  let component: MobileAppUserComponent;
  let fixture: ComponentFixture<MobileAppUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileAppUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAppUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
