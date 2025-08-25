import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleApprovalsComponent } from './vehicle-approvals.component';

describe('VehicleApprovalsComponent', () => {
  let component: VehicleApprovalsComponent;
  let fixture: ComponentFixture<VehicleApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleApprovalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
