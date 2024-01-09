import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcationSubDetailsComponent } from './procation-sub-details.component';

describe('ProcationSubDetailsComponent', () => {
  let component: ProcationSubDetailsComponent;
  let fixture: ComponentFixture<ProcationSubDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcationSubDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcationSubDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
