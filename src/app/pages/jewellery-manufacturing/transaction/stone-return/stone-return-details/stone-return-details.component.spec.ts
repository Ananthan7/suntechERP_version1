import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoneReturnDetailsComponent } from './stone-return-details.component';

describe('StoneReturnDetailsComponent', () => {
  let component: StoneReturnDetailsComponent;
  let fixture: ComponentFixture<StoneReturnDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoneReturnDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoneReturnDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
