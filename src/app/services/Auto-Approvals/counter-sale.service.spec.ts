import { TestBed } from '@angular/core/testing';

import { CounterSaleService } from './counter-sale.service';

describe('CounterSaleService', () => {
  let service: CounterSaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CounterSaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
