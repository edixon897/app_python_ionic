import { Component } from '@angular/core';
import { ConexionService } from '../services/conexion.service';
import { AlertController, AlertOptions } from '@ionic/angular';
import { ModalProoPage } from './modal-proo/modal-proo.page';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  searchTerm: string = '';
  productos: any[] = [];
  filteredProductos: any[] = [];
  searching: boolean = false;
  errorBusqueda: boolean = false;
  showNoResultsMessage: boolean | undefined;
  errorObtenerCreditos: boolean = false;
  


  constructor(private conexionService: ConexionService,
              private alertController: AlertController,
              private alertCtrl: AlertController,
              private modalcontroller:ModalController) {}

  ngOnInit () {
    this.loadProductos();
  }

  loadProductos(){
    this.conexionService.getProductos().subscribe(
      data => {
        this.productos = data
        this.filteredProductos = data;
      },
      async (error) => {
        console.error('Error al obtener datos de ventas:', error);

        // Mostrar alerta con el mensaje de error
        const alertOptions: AlertOptions = {
          header: 'Error',
          message: 'Sin conexion ha internet, intenta nuevamente',
          buttons: ['OK'],
        };
      
        const alert = await this.alertController.create(alertOptions);
        await alert.present();
      }
    )
  }

  async doRefresh(event: any){
    this.conexionService.getProductos().subscribe(
      response => {
        this.productos = response
        this.filteredProductos = response
        event.target.complete();
      }, async error => {
        // En caso de error, muestra el alerta de error y completa el evento de refresco
        console.error('Error al obtener los créditos:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Sin conexion ha internet, intenta nuevamente.',
          buttons: ['OK']
        });
        await alert.present();
        event.target.complete(); // Asegúrate de completar el evento de refresco aquí también
      }
    )
  }

  // En tu componente TypeScript
    async filterProductos(event: any) {
      this.searchTerm = event.target.value;
      this.searching = true;
      this.showNoResultsMessage = false;


      await this.delay(1000);

      this.filteredProductos = this.productos.filter((producto) =>
        producto.nombre_producto.toLowerCase().includes(this.searchTerm.toLowerCase())
      );

      this.searching = false;
      this.showNoResultsMessage = this.filteredProductos.length === 0;
    }


      async delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }

    

    
      async openModal() {
        const modal = await this.modalcontroller.create({
          component: ModalProoPage,
          componentProps: {
            // Puedes pasar datos al modal utilizando componentProps
            // Ejemplo: data: tuData
          },
        });
        return await modal.present();
      }
    }
          