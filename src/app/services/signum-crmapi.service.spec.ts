import { TestBed } from '@angular/core/testing';

import { SignumCRMApiService } from './signum-crmapi.service';

describe('SignumCRMApiService', () => {
  let service: SignumCRMApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignumCRMApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
