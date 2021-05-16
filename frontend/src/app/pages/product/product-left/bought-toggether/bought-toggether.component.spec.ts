import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoughtToggetherComponent } from './bought-toggether.component';

describe('BoughtToggetherComponent', () => {
  let component: BoughtToggetherComponent;
  let fixture: ComponentFixture<BoughtToggetherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoughtToggetherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoughtToggetherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
