import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAuthorizationComponent } from './client-authorization.component';

describe('ClientAuthorizationComponent', () => {
  let component: ClientAuthorizationComponent;
  let fixture: ComponentFixture<ClientAuthorizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAuthorizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
