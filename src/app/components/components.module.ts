import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound/notfound.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';

@NgModule({
  declarations: [NotfoundComponent, ConfirmModalComponent],
  imports: [
    CommonModule
  ],
  exports: [
    NotfoundComponent,
    ConfirmModalComponent
  ]
})
export class ComponentsModule { }
