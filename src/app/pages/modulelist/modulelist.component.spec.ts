import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulelistComponent } from './modulelist.component';

describe('ModulelistComponent', () => {
  let component: ModulelistComponent;
  let fixture: ComponentFixture<ModulelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModulelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
