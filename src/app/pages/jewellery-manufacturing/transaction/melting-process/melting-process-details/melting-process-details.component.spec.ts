import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeltingProcessDetailsComponent } from './melting-process-details.component';

describe('MeltingProcessDetailsComponent', () => {
  let component: MeltingProcessDetailsComponent;
  let fixture: ComponentFixture<MeltingProcessDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeltingProcessDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeltingProcessDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
