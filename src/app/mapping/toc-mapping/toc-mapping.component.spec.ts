import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TocMappingComponent } from './toc-mapping.component';

describe('TocMappingComponent', () => {
  let component: TocMappingComponent;
  let fixture: ComponentFixture<TocMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TocMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TocMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
