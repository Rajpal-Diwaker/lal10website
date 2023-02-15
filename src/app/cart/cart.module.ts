import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import { CartComponent } from './cart/cart.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectAddressComponent } from './select-address/select-address.component';
import { SelectPaymentComponent } from './select-payment/select-payment.component';
import { CartService } from './cart.service';

@NgModule({
  declarations: [CartComponent, SelectAddressComponent, SelectPaymentComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CartService]
})
export class CartModule { }
