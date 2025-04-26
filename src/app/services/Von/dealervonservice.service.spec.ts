import { TestBed } from '@angular/core/testing';

import { DealervonserviceService } from './dealervonservice.service';

describe('DealervonserviceService', () => {
  let service: DealervonserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DealervonserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
