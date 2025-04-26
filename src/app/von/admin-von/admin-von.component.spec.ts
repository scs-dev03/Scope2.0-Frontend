import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVonComponent } from './admin-von.component';

describe('AdminVonComponent', () => {
  let component: AdminVonComponent;
  let fixture: ComponentFixture<AdminVonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminVonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
