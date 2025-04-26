import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardChangeLogComponent } from './dasboard-change-log.component';

describe('DasboardChangeLogComponent', () => {
  let component: DasboardChangeLogComponent;
  let fixture: ComponentFixture<DasboardChangeLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasboardChangeLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DasboardChangeLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
