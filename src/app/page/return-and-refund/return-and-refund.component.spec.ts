import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnAndRefundComponent } from './return-and-refund.component';

describe('ReturnAndRefundComponent', () => {
  let component: ReturnAndRefundComponent;
  let fixture: ComponentFixture<ReturnAndRefundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnAndRefundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnAndRefundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
