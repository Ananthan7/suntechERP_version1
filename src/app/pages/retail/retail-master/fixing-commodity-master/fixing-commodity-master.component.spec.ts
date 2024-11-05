import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixingCommodityMasterComponent } from './fixing-commodity-master.component';

describe('FixingCommodityMasterComponent', () => {
  let component: FixingCommodityMasterComponent;
  let fixture: ComponentFixture<FixingCommodityMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixingCommodityMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixingCommodityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
