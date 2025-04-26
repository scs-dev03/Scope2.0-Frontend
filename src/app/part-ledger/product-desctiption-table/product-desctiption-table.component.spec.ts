import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDesctiptionTableComponent } from './product-desctiption-table.component';

describe('ProductDesctiptionTableComponent', () => {
  let component: ProductDesctiptionTableComponent;
  let fixture: ComponentFixture<ProductDesctiptionTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDesctiptionTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductDesctiptionTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
