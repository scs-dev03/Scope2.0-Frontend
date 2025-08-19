import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandWiseUserMappingComponent } from './brand-wise-user-mapping.component';

describe('BrandWiseUserMappingComponent', () => {
  let component: BrandWiseUserMappingComponent;
  let fixture: ComponentFixture<BrandWiseUserMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrandWiseUserMappingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrandWiseUserMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
