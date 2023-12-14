import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCentreMetalDetailsComponent } from './cost-centre-metal-details.component';

describe('CostCentreMetalDetailsComponent', () => {
  let component: CostCentreMetalDetailsComponent;
  let fixture: ComponentFixture<CostCentreMetalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCentreMetalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCentreMetalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
