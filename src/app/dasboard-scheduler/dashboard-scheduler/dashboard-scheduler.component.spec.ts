import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSchedulerComponent } from './dashboard-scheduler.component';

describe('DashboardSchedulerComponent', () => {
  let component: DashboardSchedulerComponent;
  let fixture: ComponentFixture<DashboardSchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSchedulerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
