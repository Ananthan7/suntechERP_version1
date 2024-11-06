import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubledgerPrefixMasterComponent } from './subledger-prefix-master.component';

describe('SubledgerPrefixMasterComponent', () => {
  let component: SubledgerPrefixMasterComponent;
  let fixture: ComponentFixture<SubledgerPrefixMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubledgerPrefixMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubledgerPrefixMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
