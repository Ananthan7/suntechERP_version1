import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintPrivilegeCardComponent } from './print-privilege-card.component';

describe('PrintPrivilegeCardComponent', () => {
  let component: PrintPrivilegeCardComponent;
  let fixture: ComponentFixture<PrintPrivilegeCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintPrivilegeCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintPrivilegeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
