import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeltingProcessComponent } from './melting-process.component';

describe('MeltingProcessComponent', () => {
  let component: MeltingProcessComponent;
  let fixture: ComponentFixture<MeltingProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeltingProcessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeltingProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
