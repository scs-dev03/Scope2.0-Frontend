import { TestBed } from '@angular/core/testing';

import { PmServiceService } from './pm-service.service';

describe('PmServiceService', () => {
  let service: PmServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PmServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
