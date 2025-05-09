import { TestBed } from '@angular/core/testing';

import { MappingMasterService } from './mapping-master.service';

describe('MappingMasterService', () => {
  let service: MappingMasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MappingMasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
