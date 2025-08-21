import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBulkUploadComponent } from './admin-bulk-upload.component';

describe('AdminBulkUploadComponent', () => {
  let component: AdminBulkUploadComponent;
  let fixture: ComponentFixture<AdminBulkUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBulkUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminBulkUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
