import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceschemesMasterComponent } from './priceschemes-master.component';

describe('PriceschemesMasterComponent', () => {
  let component: PriceschemesMasterComponent;
  let fixture: ComponentFixture<PriceschemesMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceschemesMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceschemesMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
