import { TestBed } from '@angular/core/testing';

import { AdvisorServiceService } from './advisor-service.service';

describe('AdvisorServiceService', () => {
  let service: AdvisorServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvisorServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
