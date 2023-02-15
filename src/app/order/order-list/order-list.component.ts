import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { OrderService } from '../order.service';
import { GoogleAnalyticsService } from 'src/app/google-analytics.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {
  orderListArr;
  defaultImage = 'assets/images/placeholder.png';

  constructor(private mainService: UserService, private orderService: OrderService,
              private googleAnalyticsService: GoogleAnalyticsService) { }

  ngOnInit() {
    this.mainService.setTitle('My Orders');
    this.googleAnalyticsService.pageView('My Orders');
    this.getOrderList();
  }

  // function to get order list
  getOrderList() {
    this.orderService.getOrder().subscribe(response => {
      if (response && response.code === 200) {
        this.mainService.hideSpinner();
        this.orderListArr = response.result;
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
    this.googleAnalyticsService.eventEmitter('My Orders', type);
  }

}
