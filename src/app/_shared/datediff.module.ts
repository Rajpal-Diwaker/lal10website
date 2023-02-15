import { NgModule } from '@angular/core';
import { ModalModule } from "ngx-modal";
import { DatediffPipe } from '../_pipes/datediff.pipe';
import { nl2brPipe } from '../_pipes/nl2br.pipe';
import { SafeHTML } from '../_pipes/safeHtml.pipe';

@NgModule({
  declarations: [nl2brPipe, SafeHTML],
  imports: [

  ],
  exports: [
     nl2brPipe,
     SafeHTML
  ]
})
export class DatediffModule { }
