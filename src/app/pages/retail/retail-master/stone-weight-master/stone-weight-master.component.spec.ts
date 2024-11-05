import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoneWeightMasterComponent } from './stone-weight-master.component';

describe('StoneWeightMasterComponent', () => {
  let component: StoneWeightMasterComponent;
  let fixture: ComponentFixture<StoneWeightMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoneWeightMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoneWeightMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
