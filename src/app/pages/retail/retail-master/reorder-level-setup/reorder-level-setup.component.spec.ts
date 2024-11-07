import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReorderLevelSetupComponent } from './reorder-level-setup.component';

describe('ReorderLevelSetupComponent', () => {
  let component: ReorderLevelSetupComponent;
  let fixture: ComponentFixture<ReorderLevelSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReorderLevelSetupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReorderLevelSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
