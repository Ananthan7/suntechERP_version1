import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignSequenceComponent } from './design-sequence.component';

describe('DesignSequenceComponent', () => {
  let component: DesignSequenceComponent;
  let fixture: ComponentFixture<DesignSequenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignSequenceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignSequenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
