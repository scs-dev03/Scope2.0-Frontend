import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorManagementComponent } from './advisor-management.component';

describe('AdvisorManagementComponent', () => {
  let component: AdvisorManagementComponent;
  let fixture: ComponentFixture<AdvisorManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvisorManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvisorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
