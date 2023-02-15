import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../_shared/shared.module';
import { RegistrationComponent } from './registration/registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { UserService } from '../_services/user.service';

@NgModule({
  declarations: [LoginComponent, RegistrationComponent, ForgotPasswordComponent, ResetPasswordComponent, VerifyEmailComponent, SubscribeComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
  ],
  providers: [UserService]
})
export class UserModule { }
