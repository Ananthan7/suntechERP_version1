import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SequanceMasterComponent } from './sequance-master.component';

describe('SequanceMasterComponent', () => {
  let component: SequanceMasterComponent;
  let fixture: ComponentFixture<SequanceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SequanceMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SequanceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
