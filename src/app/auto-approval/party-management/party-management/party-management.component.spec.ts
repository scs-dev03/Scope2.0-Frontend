import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyManagementComponent } from './party-management.component';

describe('PartyManagementComponent', () => {
  let component: PartyManagementComponent;
  let fixture: ComponentFixture<PartyManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartyManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
