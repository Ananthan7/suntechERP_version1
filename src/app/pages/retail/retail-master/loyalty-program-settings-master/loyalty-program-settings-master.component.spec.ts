import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoyaltyProgramSettingsMasterComponent } from './loyalty-program-settings-master.component';

describe('LoyaltyProgramSettingsMasterComponent', () => {
  let component: LoyaltyProgramSettingsMasterComponent;
  let fixture: ComponentFixture<LoyaltyProgramSettingsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoyaltyProgramSettingsMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoyaltyProgramSettingsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
