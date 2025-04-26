import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminpendingcountComponent } from './adminpendingcount.component';

describe('AdminpendingcountComponent', () => {
  let component: AdminpendingcountComponent;
  let fixture: ComponentFixture<AdminpendingcountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminpendingcountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminpendingcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
