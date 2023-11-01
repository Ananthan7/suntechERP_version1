import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewdetailComponent } from './add-newdetail.component';

describe('AddNewdetailComponent', () => {
  let component: AddNewdetailComponent;
  let fixture: ComponentFixture<AddNewdetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewdetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
