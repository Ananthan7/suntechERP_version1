import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducationSubDetailsComponent } from './producation-sub-details.component';

describe('ProducationSubDetailsComponent', () => {
  let component: ProducationSubDetailsComponent;
  let fixture: ComponentFixture<ProducationSubDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProducationSubDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProducationSubDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
