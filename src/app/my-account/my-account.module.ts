import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyAccountRoutingModule } from './my-account-routing.module';
import { ProfileContainerComponent } from './profile-container/profile-container.component';
import { ProfileComponent } from './profile/profile.component';
import { CardsComponent } from './cards/cards.component';
import { AddressComponent } from './address/address.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountService } from './account.service';

@NgModule({
  declarations: [ProfileContainerComponent, ProfileComponent, CardsComponent, AddressComponent],
  imports: [
    CommonModule,
    MyAccountRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [AccountService]
})
export class MyAccountModule { }
