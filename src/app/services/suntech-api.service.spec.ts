import { TestBed } from '@angular/core/testing';

import { SuntechAPIService } from './suntech-api.service';

describe('SuntechAPIService', () => {
  let service: SuntechAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuntechAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
