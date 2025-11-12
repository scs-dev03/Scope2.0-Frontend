import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewNotInMasterComponent } from './view-not-in-master.component';

describe('ViewNotInMasterComponent', () => {
  let component: ViewNotInMasterComponent;
  let fixture: ComponentFixture<ViewNotInMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewNotInMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewNotInMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
