import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetalleClienteModalPage } from './detalle-cliente-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DetalleClienteModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetalleClienteModalPageRoutingModule {}
