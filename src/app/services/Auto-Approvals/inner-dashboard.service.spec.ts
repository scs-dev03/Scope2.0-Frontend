import { TestBed } from '@angular/core/testing';

import { InnerDashboardService } from './inner-dashboard.service';

describe('InnerDashboardService', () => {
  let service: InnerDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InnerDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
