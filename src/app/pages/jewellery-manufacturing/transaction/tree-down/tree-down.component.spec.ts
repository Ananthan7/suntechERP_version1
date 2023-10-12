import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeDownComponent } from './tree-down.component';

describe('TreeDownComponent', () => {
  let component: TreeDownComponent;
  let fixture: ComponentFixture<TreeDownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreeDownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeDownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
