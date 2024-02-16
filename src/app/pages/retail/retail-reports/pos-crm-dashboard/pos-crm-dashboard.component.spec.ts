import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosCrmDashboardComponent } from './pos-crm-dashboard.component';

describe('PosCrmDashboardComponent', () => {
  let component: PosCrmDashboardComponent;
  let fixture: ComponentFixture<PosCrmDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PosCrmDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PosCrmDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
