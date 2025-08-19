import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllApprovalsComponent } from './all-approvals.component';

describe('AllApprovalsComponent', () => {
  let component: AllApprovalsComponent;
  let fixture: ComponentFixture<AllApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllApprovalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
