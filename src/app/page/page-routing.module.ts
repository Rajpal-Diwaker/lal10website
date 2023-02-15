import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { BlogsComponent } from './blogs/blogs.component';
import { CareerComponent } from './career/career.component';
import { ReturnAndRefundComponent } from './return-and-refund/return-and-refund.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SitemapComponent } from './sitemap/sitemap.component';

const routes: Routes = [
  { path: 'about', component: AboutComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'career', component: CareerComponent },
  { path: 'return&refund', component: ReturnAndRefundComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'sitemap', component: SitemapComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
