import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BucketManagementComponent } from './bucket-management.component';

describe('BucketManagementComponent', () => {
  let component: BucketManagementComponent;
  let fixture: ComponentFixture<BucketManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BucketManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BucketManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
