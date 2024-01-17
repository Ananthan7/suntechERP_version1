import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignTransactionComponent } from './design-transaction.component';

describe('DesignTransactionComponent', () => {
  let component: DesignTransactionComponent;
  let fixture: ComponentFixture<DesignTransactionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignTransactionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
