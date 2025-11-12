import { TestBed } from '@angular/core/testing';

import { NotinmasterService } from './notinmaster.service';

describe('NotinmasterService', () => {
  let service: NotinmasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotinmasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
