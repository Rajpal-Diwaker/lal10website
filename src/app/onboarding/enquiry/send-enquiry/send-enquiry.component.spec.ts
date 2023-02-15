import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendEnquiryComponent } from './send-enquiry.component';

describe('SendEnquiryComponent', () => {
  let component: SendEnquiryComponent;
  let fixture: ComponentFixture<SendEnquiryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SendEnquiryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEnquiryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
