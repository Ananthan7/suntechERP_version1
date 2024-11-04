import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FestivalMasterComponent } from './festival-master.component';

describe('FestivalMasterComponent', () => {
  let component: FestivalMasterComponent;
  let fixture: ComponentFixture<FestivalMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FestivalMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FestivalMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
