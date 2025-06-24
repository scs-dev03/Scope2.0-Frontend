import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEditExportComponent } from './view-edit-export.component';

describe('ViewEditExportComponent', () => {
  let component: ViewEditExportComponent;
  let fixture: ComponentFixture<ViewEditExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewEditExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewEditExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
