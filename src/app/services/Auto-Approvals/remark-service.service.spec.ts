import { TestBed } from '@angular/core/testing';

import { RemarkServiceService } from './remark-service.service';

describe('RemarkServiceService', () => {
  let service: RemarkServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemarkServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
