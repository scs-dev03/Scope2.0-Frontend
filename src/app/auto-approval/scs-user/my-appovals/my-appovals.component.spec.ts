import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAppovalsComponent } from './my-appovals.component';

describe('MyAppovalsComponent', () => {
  let component: MyAppovalsComponent;
  let fixture: ComponentFixture<MyAppovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyAppovalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyAppovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
