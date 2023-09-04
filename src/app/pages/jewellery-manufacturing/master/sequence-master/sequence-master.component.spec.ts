import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SequenceMasterComponent } from './sequence-master.component';

describe('SequenceMasterComponent', () => {
  let component: SequenceMasterComponent;
  let fixture: ComponentFixture<SequenceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SequenceMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SequenceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
