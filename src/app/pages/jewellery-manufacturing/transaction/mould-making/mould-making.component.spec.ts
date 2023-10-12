import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouldMakingComponent } from './mould-making.component';

describe('MouldMakingComponent', () => {
  let component: MouldMakingComponent;
  let fixture: ComponentFixture<MouldMakingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MouldMakingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MouldMakingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
