import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../order.service';
import { UserService } from '../../_services/user.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
  id;
  enqDetailObj;
  defaultImage = 'assets/images/placeholder.png';
  type;

  constructor(private route: ActivatedRoute, private orderService: OrderService, private mainService: UserService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.type = this.route.snapshot.paramMap.get('type');
    if (this.type === 'enq') {
      this.mainService.setTitle('Track Enquiry');
      this.googleAnalyticsService.pageView('Track Enquiry');
      this.getEnquiryDetail();
    } else {
      this.mainService.setTitle('Track Package');
      this.googleAnalyticsService.pageView('Track Package');
      this.getOrderDetail();
    }
  }

  // function to get enq detail
  getEnquiryDetail() {
    this.orderService.enquiryDetail(this.id).subscribe(res => {
      if (res && res.code === 200) {
        this.enqDetailObj = res.result;
        this.enqDetailObj.update_status = '';
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

  // function to get order detail
  getOrderDetail() {
    this.orderService.orderDetail(this.id).subscribe(res => {
      if (res && res.code === 200) {
        this.enqDetailObj = res.result;
        this.enqDetailObj.update_status = '';
      } else {
        this.mainService.error(res.message);
      }
    }, error => {
      this.mainService.error(error);
    });
  }

}
