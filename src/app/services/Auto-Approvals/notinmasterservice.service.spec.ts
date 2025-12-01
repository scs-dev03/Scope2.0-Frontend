import { TestBed } from '@angular/core/testing';

import { NotinmasterserviceService } from './notinmasterservice.service';

describe('NotinmasterserviceService', () => {
  let service: NotinmasterserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotinmasterserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
