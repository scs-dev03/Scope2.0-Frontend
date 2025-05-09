import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCreateUserComponent } from './view-create-user.component';

describe('ViewCreateUserComponent', () => {
  let component: ViewCreateUserComponent;
  let fixture: ComponentFixture<ViewCreateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCreateUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
