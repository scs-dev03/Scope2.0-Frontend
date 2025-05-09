import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePasswordWhileCreateUserComponent } from './update-password-while-create-user.component';

describe('UpdatePasswordWhileCreateUserComponent', () => {
  let component: UpdatePasswordWhileCreateUserComponent;
  let fixture: ComponentFixture<UpdatePasswordWhileCreateUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatePasswordWhileCreateUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatePasswordWhileCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
