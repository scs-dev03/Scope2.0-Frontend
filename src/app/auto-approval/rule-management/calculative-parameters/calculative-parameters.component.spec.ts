import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculativeParametersComponent } from './calculative-parameters.component';

describe('CalculativeParametersComponent', () => {
  let component: CalculativeParametersComponent;
  let fixture: ComponentFixture<CalculativeParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculativeParametersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculativeParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
