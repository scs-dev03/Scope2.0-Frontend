import { TestBed } from '@angular/core/testing';

import { DealerUserServiceService } from './dealer-user-service.service';

describe('DealerUserServiceService', () => {
  let service: DealerUserServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealerUserServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
