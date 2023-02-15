import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CartComponent } from './cart/cart.component';
import { SelectAddressComponent } from './select-address/select-address.component';
import { SelectPaymentComponent } from './select-payment/select-payment.component';

const routes: Routes = [
  { path: '', component: CartComponent },
  { path: 'select-address', component: SelectAddressComponent },
  { path: 'checkout', component: SelectPaymentComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartRoutingModule { }
