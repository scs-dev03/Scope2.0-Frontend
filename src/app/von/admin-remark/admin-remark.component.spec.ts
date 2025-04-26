import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRemarkComponent } from './admin-remark.component';

describe('AdminRemarkComponent', () => {
  let component: AdminRemarkComponent;
  let fixture: ComponentFixture<AdminRemarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRemarkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRemarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
