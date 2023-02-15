import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { UserService } from '../../_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-enquiry-list',
  templateUrl: './enquiry-list.component.html',
  styleUrls: ['./enquiry-list.component.css']
})
export class EnquiryListComponent implements OnInit {
  enquiryListArr;
  defaultImage = 'assets/images/placeholder.png';

  constructor(private orderService: OrderService, private mainService: UserService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('My enquiries');
    this.googleAnalyticsService.pageView('My enquiries');
    this.getEnquiryList();
  }

  // function to get enquiry list
  getEnquiryList() {
    this.orderService.getEnquiry().subscribe(response => {
      if (response && response.code === 200) {
        this.mainService.hideSpinner();
        this.enquiryListArr = response.result;
      } else {
        this.mainService.error(response.message);
        this.mainService.hideSpinner();
      }
    }, error => {
      this.mainService.error(error);
      this.mainService.hideSpinner();
    });
  }

  sendEvent(type: string) {
    this.googleAnalyticsService.eventEmitter('My enquiries', type);
  }

}
