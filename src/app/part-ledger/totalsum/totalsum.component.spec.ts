import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalsumComponent } from './totalsum.component';

describe('TotalsumComponent', () => {
  let component: TotalsumComponent;
  let fixture: ComponentFixture<TotalsumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalsumComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalsumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
