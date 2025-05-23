import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerSalesReportComponent } from './dealer-sales-report.component';

describe('DealerSalesReportComponent', () => {
  let component: DealerSalesReportComponent;
  let fixture: ComponentFixture<DealerSalesReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerSalesReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerSalesReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
