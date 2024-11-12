import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileAppSettingComponent } from './mobile-app-setting.component';

describe('MobileAppSettingComponent', () => {
  let component: MobileAppSettingComponent;
  let fixture: ComponentFixture<MobileAppSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileAppSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MobileAppSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
