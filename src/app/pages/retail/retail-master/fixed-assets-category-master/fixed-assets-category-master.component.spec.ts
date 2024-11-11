import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetsCategoryMasterComponent } from './fixed-assets-category-master.component';

describe('FixedAssetsCategoryMasterComponent', () => {
  let component: FixedAssetsCategoryMasterComponent;
  let fixture: ComponentFixture<FixedAssetsCategoryMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixedAssetsCategoryMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedAssetsCategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
