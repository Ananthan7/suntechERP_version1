import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirTicketMasterComponent } from './air-ticket-master.component';

describe('AirTicketMasterComponent', () => {
  let component: AirTicketMasterComponent;
  let fixture: ComponentFixture<AirTicketMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AirTicketMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AirTicketMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
