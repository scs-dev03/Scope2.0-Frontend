import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockApprovalsComponent } from './stock-approvals.component';

describe('StockApprovalsComponent', () => {
  let component: StockApprovalsComponent;
  let fixture: ComponentFixture<StockApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockApprovalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
