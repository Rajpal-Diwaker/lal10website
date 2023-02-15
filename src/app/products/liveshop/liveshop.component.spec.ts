import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveshopComponent } from './liveshop.component';

describe('LiveshopComponent', () => {
  let component: LiveshopComponent;
  let fixture: ComponentFixture<LiveshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveshopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
