import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerVonComponent } from './dealer-von.component';

describe('DealerVonComponent', () => {
  let component: DealerVonComponent;
  let fixture: ComponentFixture<DealerVonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerVonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealerVonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
