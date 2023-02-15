import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AllproductsComponent } from './allproducts/allproducts.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { LiveshopComponent } from './liveshop/liveshop.component';

const routes: Routes = [
  { path: '', component: AllproductsComponent },
  { path: 'detail', component: ProductDetailsComponent },
  { path: 'liveshop', component: LiveshopComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }
