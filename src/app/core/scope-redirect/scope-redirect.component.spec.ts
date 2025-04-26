import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopeRedirectComponent } from './scope-redirect.component';

describe('ScopeRedirectComponent', () => {
  let component: ScopeRedirectComponent;
  let fixture: ComponentFixture<ScopeRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopeRedirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScopeRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
