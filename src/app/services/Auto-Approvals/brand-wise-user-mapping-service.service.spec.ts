import { TestBed } from '@angular/core/testing';

import { BrandWiseUserMappingServiceService } from './brand-wise-user-mapping-service.service';

describe('BrandWiseUserMappingServiceService', () => {
  let service: BrandWiseUserMappingServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandWiseUserMappingServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
