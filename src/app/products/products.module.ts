import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { AllproductsComponent } from './allproducts/allproducts.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { Ng5SliderModule } from 'ng5-slider';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { LiveshopComponent } from './liveshop/liveshop.component';
import { DatediffModule } from '../_shared/datediff.module';
import { ProductService } from './product.service';

@NgModule({
  declarations: [AllproductsComponent, ProductDetailsComponent, LiveshopComponent],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    LazyLoadImageModule,
    Ng5SliderModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    InfiniteScrollModule,
    DatediffModule
  ],
  providers: [ProductService]
})
export class ProductsModule { }
