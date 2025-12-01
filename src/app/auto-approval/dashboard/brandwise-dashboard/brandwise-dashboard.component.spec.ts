import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandwiseDashboardComponent } from './brandwise-dashboard.component';

describe('BrandwiseDashboardComponent', () => {
  let component: BrandwiseDashboardComponent;
  let fixture: ComponentFixture<BrandwiseDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandwiseDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandwiseDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
