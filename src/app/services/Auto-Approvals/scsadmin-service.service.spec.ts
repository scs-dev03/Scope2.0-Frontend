import { TestBed } from '@angular/core/testing';

import { ScsadminServiceService } from './scsadmin-service.service';

describe('ScsadminServiceService', () => {
  let service: ScsadminServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScsadminServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
