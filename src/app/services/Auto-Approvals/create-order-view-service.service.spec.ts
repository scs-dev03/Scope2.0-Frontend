import { TestBed } from '@angular/core/testing';

import { CreateOrderViewServiceService } from './create-order-view-service.service';

describe('CreateOrderViewServiceService', () => {
  let service: CreateOrderViewServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateOrderViewServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
