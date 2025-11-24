import { TestBed } from '@angular/core/testing';

import { RuleViewManageService } from './rule-view-manage.service';

describe('RuleViewManageService', () => {
  let service: RuleViewManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RuleViewManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
