import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VechileOrderRequestComponent } from './vechile-order-request.component';

describe('VechileOrderRequestComponent', () => {
  let component: VechileOrderRequestComponent;
  let fixture: ComponentFixture<VechileOrderRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VechileOrderRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VechileOrderRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
