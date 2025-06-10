import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardSchedulerComponent } from './admin-dashboard-scheduler.component';

describe('AdminDashboardSchedulerComponent', () => {
  let component: AdminDashboardSchedulerComponent;
  let fixture: ComponentFixture<AdminDashboardSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardSchedulerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
