import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastingTreeUpComponent } from './casting-tree-up.component';

describe('CastingTreeUpComponent', () => {
  let component: CastingTreeUpComponent;
  let fixture: ComponentFixture<CastingTreeUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CastingTreeUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CastingTreeUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
