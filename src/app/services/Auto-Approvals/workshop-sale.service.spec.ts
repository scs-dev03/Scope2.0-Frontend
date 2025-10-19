import { TestBed } from '@angular/core/testing';

import { WorkshopSaleService } from './workshop-sale.service';

describe('WorkshopSaleService', () => {
  let service: WorkshopSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkshopSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
