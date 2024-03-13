import { Component } from '@angular/core';
import { ConexionService } from '../services/conexion.service';
import { AlertController } from '@ionic/angular';

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
              private alertController: AlertController) {}

  ngOnInit () {
    this.loadProductos();
  }

  loadProductos(){
    this.conexionService.getProductos().subscribe(
      data => {
        this.productos = data
        this.filteredProductos = data;
      },
      (error) => {
        console.error('Error en la búsqueda:', error);
        this.errorBusqueda = true;  // Activa el indicador de error
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
          message: 'Ha ocurrido un error al intentar obtener la infomacion. Por favor, revisa tu conexión a internet e intenta nuevamente.',
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

    }
