import { TestBed } from '@angular/core/testing';

import { DashboardSchedulerService } from './dashboard-scheduler.service';

describe('DashboardSchedulerService', () => {
  let service: DashboardSchedulerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardSchedulerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
