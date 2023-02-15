import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PageRoutingModule } from './page-routing.module';
import { AboutComponent } from './about/about.component';
import { BlogsComponent } from './blogs/blogs.component';
import { CareerComponent } from './career/career.component';
import { ReturnAndRefundComponent } from './return-and-refund/return-and-refund.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { PageService } from './page.service';
import { SitemapComponent } from './sitemap/sitemap.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DatediffModule } from '../_shared/datediff.module';

@NgModule({
  declarations: [AboutComponent, BlogsComponent, CareerComponent, ReturnAndRefundComponent, PrivacyComponent, SitemapComponent],
  imports: [
    CommonModule,
    PageRoutingModule,
    LazyLoadImageModule,
    ReactiveFormsModule,
    FormsModule,
    DatediffModule
  ],
  providers: [PageService]
})
export class PageModule { }
