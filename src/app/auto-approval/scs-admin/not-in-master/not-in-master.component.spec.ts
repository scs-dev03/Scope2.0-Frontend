import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotInMasterComponent } from './not-in-master.component';

describe('NotInMasterComponent', () => {
  let component: NotInMasterComponent;
  let fixture: ComponentFixture<NotInMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotInMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotInMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
