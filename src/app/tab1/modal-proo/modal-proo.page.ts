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
    
  }
}
  
  