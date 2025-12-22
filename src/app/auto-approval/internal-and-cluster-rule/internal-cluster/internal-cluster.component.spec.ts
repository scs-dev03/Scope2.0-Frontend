import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalClusterComponent } from './internal-cluster.component';

describe('InternalClusterComponent', () => {
  let component: InternalClusterComponent;
  let fixture: ComponentFixture<InternalClusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InternalClusterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
