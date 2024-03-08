// Importa ModalController desde '@ionic/angular'
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-detalle-cliente-modal',
  templateUrl: './detalle-cliente-modal.page.html',
  styleUrls: ['./detalle-cliente-modal.page.scss'],
})
export class DetalleClienteModalPage implements OnInit {
  @Input() detallesCliente: any;

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  cerrarModal() {
    this.modalController.dismiss();
  }
}
