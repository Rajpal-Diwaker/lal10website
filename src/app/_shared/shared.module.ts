import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NumberonlyDirective } from '../_directives/numberonly.directive';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [NumberonlyDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ReactiveFormsModule,
    NumberonlyDirective,
    FormsModule
  ]
})
export class SharedModule { }
