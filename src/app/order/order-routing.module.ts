import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { EnquiryListComponent } from './enquiry-list/enquiry-list.component';
import { TrackComponent } from './track/track.component';

const routes: Routes = [
  { path: 'order-list', component: OrderListComponent },
  { path: 'enquiry-list', component: EnquiryListComponent },
  { path: 'track/:id/:type', component: TrackComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
