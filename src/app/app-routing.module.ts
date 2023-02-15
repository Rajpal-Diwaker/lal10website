import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './_guards/auth.guard'

const routes: Routes = [
      {
        path: 'products',
        loadChildren: './products/products.module#ProductsModule'
      },
      {
        path: 'cart',
        canActivate: [AuthGuard],
        loadChildren: './cart/cart.module#CartModule'
      },
      {
        path: 'orders',
        canActivate: [AuthGuard],
        loadChildren: './order/order.module#OrderModule'
      },
      {
        path: 'faqs',
        loadChildren: './faqs/faqs.module#FaqsModule'
      },
      {
        path: 'page',
        loadChildren: './page/page.module#PageModule'
      },
      {
        path: 'account',
        canActivate: [AuthGuard],
        loadChildren: './my-account/my-account.module#MyAccountModule'
      },
      // {
      //   path: 'onboarding',
      //   loadChildren: './onboarding/onboarding.module#OnboardingModule'
      // },
      {
        path: 'user',
        loadChildren: './user/user.module#UserModule'
      },
      {
        path: '',
        loadChildren: './onboarding/onboarding.module#OnboardingModule'
      },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
