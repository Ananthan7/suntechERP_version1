import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManufacturedItemsComponent } from './manufactured-items.component';

describe('ManufacturedItemsComponent', () => {
  let component: ManufacturedItemsComponent;
  let fixture: ComponentFixture<ManufacturedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManufacturedItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManufacturedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
