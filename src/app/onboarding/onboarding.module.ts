import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { Routes, RouterModule } from '@angular/router';
import { OnboardingService } from './onboarding.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SendEnquiryComponent } from './enquiry/send-enquiry/send-enquiry.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { AgmCoreModule } from '@agm/core';
import { DatediffModule } from '../_shared/datediff.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

const routes: Routes = [
  { path: '', component: OnboardingComponent },
  { path: 'sendEnquiry', component: SendEnquiryComponent },
  { path: 'search', component: SearchResultComponent }
];

@NgModule({
  declarations: [OnboardingComponent, SendEnquiryComponent, SearchResultComponent],
  imports: [
    CommonModule,
    // OnboardingRoutingModule,
    RouterModule.forChild(routes),
    CarouselModule,
    FormsModule,
    ReactiveFormsModule,
    LazyLoadImageModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDAIJ08X0BznyCJXQiD5Dt3cRXWoj8WZd8'
    }),
    DatediffModule,
    InfiniteScrollModule
  ],
  providers: [OnboardingService],
  exports: []
})
export class OnboardingModule { }
