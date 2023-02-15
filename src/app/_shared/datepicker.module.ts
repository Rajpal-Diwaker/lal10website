import { NgModule } from '@angular/core';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [],
  imports: [
    AngularMyDatePickerModule,
    NgxMaterialTimepickerModule
  ],
  exports: [
    AngularMyDatePickerModule,
    NgxMaterialTimepickerModule
  ]
})
export class DatepickerModule { }
