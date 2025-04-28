import { TestBed } from '@angular/core/testing';

import { RoleBasedService } from './role-based.service';

describe('RoleBasedService', () => {
  let service: RoleBasedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleBasedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
