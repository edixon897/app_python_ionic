import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Input } from '@angular/core';
import { ConexionService } from 'src/app/services/conexion.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-proo',
  templateUrl: './modal-proo.page.html',
  styleUrls: ['./modal-proo.page.scss'],
})
export class ModalProoPage implements OnInit {
  proveedores: any[] = [];
  filteredProductos: any[] = [];
  searchTerm: string = '';
  searching: boolean = false;
  errorBusqueda: boolean = false;
  showNoResultsMessage: boolean | undefined;
  errorObtenerCreditos: boolean = false;
  constructor(private modalcontroller:ModalController,
    private conexion:ConexionService,
    private httpclient:HttpClient
    ) { }

  ngOnInit() {
    this.visualizaDatos()
  }

  
  visualizaDatos(){
    this.conexion.getproveedores().subscribe(
      data => {
        this.proveedores = data
        this.filteredProductos = data;
      }
    )
     }

  cerrarModal() {
    this.modalcontroller.dismiss();
  }

  async filterProductos(event: any) {
    this.searchTerm = event.target.value;
    this.searching = true;
    this.showNoResultsMessage = false;


    await this.delay(1000);

    this.filteredProductos = this.proveedores.filter((p) =>
    p.nom_proveedor.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.searching = false;
    this.showNoResultsMessage = this.filteredProductos.length === 0;
  }
  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
}
