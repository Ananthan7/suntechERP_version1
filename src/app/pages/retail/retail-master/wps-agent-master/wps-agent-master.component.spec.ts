import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WpsAgentMasterComponent } from './wps-agent-master.component';

describe('WpsAgentMasterComponent', () => {
  let component: WpsAgentMasterComponent;
  let fixture: ComponentFixture<WpsAgentMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WpsAgentMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WpsAgentMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
