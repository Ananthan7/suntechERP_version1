import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionReferenceMasterComponent } from './transaction-reference-master.component';

describe('TransactionReferenceMasterComponent', () => {
  let component: TransactionReferenceMasterComponent;
  let fixture: ComponentFixture<TransactionReferenceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransactionReferenceMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionReferenceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
