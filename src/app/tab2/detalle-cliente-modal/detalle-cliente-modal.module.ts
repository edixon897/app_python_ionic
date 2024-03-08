import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleClienteModalPageRoutingModule } from './detalle-cliente-modal-routing.module';

import { DetalleClienteModalPage } from './detalle-cliente-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleClienteModalPageRoutingModule
  ],
  declarations: [DetalleClienteModalPage]
})
export class DetalleClienteModalPageModule {}
