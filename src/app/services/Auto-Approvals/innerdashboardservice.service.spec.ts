import { TestBed } from '@angular/core/testing';

import { InnerdashboardserviceService } from './innerdashboardservice.service';

describe('InnerdashboardserviceService', () => {
  let service: InnerdashboardserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InnerdashboardserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
