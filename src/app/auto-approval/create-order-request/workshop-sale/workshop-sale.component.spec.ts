import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkshopSaleComponent } from './workshop-sale.component';

describe('WorkshopSaleComponent', () => {
  let component: WorkshopSaleComponent;
  let fixture: ComponentFixture<WorkshopSaleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkshopSaleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkshopSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
