import { TestBed } from '@angular/core/testing';

import { AdminReportServiceService } from './admin-report-service.service';

describe('AdminReportServiceService', () => {
  let service: AdminReportServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminReportServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
