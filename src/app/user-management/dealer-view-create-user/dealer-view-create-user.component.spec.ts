import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerViewCreateUserComponent } from './dealer-view-create-user.component';

describe('DealerViewCreateUserComponent', () => {
  let component: DealerViewCreateUserComponent;
  let fixture: ComponentFixture<DealerViewCreateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerViewCreateUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerViewCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
