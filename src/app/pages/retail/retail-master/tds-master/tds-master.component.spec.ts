import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TdsMasterComponent } from './tds-master.component';

describe('TdsMasterComponent', () => {
  let component: TdsMasterComponent;
  let fixture: ComponentFixture<TdsMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TdsMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TdsMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
