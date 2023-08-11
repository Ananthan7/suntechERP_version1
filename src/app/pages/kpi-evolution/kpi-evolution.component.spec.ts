import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiEvolutionComponent } from './kpi-evolution.component';

describe('KpiEvolutionComponent', () => {
  let component: KpiEvolutionComponent;
  let fixture: ComponentFixture<KpiEvolutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiEvolutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiEvolutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
