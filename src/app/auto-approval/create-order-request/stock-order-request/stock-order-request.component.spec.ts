import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockOrderRequestComponent } from './stock-order-request.component';

describe('StockOrderRequestComponent', () => {
  let component: StockOrderRequestComponent;
  let fixture: ComponentFixture<StockOrderRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockOrderRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockOrderRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
