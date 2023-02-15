import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FaqsRoutingModule } from './faqs-routing.module';
import { FaqListComponent } from './faq-list/faq-list.component';
import { FaqService } from './faq.service';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { DatediffModule } from '../_shared/datediff.module';

@NgModule({
  declarations: [FaqListComponent],
  imports: [
    CommonModule,
    FaqsRoutingModule,
    LazyLoadImageModule,
    DatediffModule
  ],
  providers: [FaqService]
})
export class FaqsModule { }
