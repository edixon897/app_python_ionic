import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalProoPageRoutingModule } from './modal-proo-routing.module';

import { ModalProoPage } from './modal-proo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalProoPageRoutingModule
  ],
  declarations: [ModalProoPage]
})
export class ModalProoPageModule {}
