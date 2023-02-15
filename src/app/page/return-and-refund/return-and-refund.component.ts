import { Component, OnInit } from '@angular/core';
import { PageService } from '../page.service';
import { UserService } from '../../_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-return-and-refund',
  templateUrl: './return-and-refund.component.html',
  styleUrls: ['./return-and-refund.component.css']
})
export class ReturnAndRefundComponent implements OnInit {
  refundObj;

  constructor(private pageService: PageService, private mainService: UserService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('Return & Refund Policy');
    this.googleAnalyticsService.pageView('Return & Refund Policy');
    this.getRefundPolicy();
  }

  // function to get return and refund policy
  getRefundPolicy() {
    this.pageService.returnPolicy().subscribe(res => {
      if (res && res.code === 200) {
        this.refundObj = res.result;
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

}
