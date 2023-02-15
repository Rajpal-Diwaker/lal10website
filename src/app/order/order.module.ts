import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderService } from './order.service';
import { OrderListComponent } from './order-list/order-list.component';
import { EnquiryListComponent } from './enquiry-list/enquiry-list.component';
import { TrackComponent } from './track/track.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';

@NgModule({
  declarations: [OrderListComponent, EnquiryListComponent, TrackComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    LazyLoadImageModule
  ],
  providers: [OrderService]
})
export class OrderModule { }
