import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBreadcrumComponent } from './search-breadcrum.component';

describe('SearchBreadcrumComponent', () => {
  let component: SearchBreadcrumComponent;
  let fixture: ComponentFixture<SearchBreadcrumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchBreadcrumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBreadcrumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
