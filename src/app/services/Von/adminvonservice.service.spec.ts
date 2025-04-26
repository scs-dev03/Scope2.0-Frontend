import { TestBed } from '@angular/core/testing';

import { AdminvonserviceService } from './adminvonservice.service';

describe('AdminvonserviceService', () => {
  let service: AdminvonserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminvonserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
