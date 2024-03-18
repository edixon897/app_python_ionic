import { Component } from '@angular/core';
import { ConexionService } from '../services/conexion.service';
import { DetalleClienteModalPage } from './detalle-cliente-modal/detalle-cliente-modal.page';
import { AlertController, AlertOptions, ModalController } from '@ionic/angular';






@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  searchTerm: string = '';
  creditos: any[] = [];
  filteredCreditos: any[] = [];
  searching: boolean = false;
  errorBusqueda: boolean = false;
  showNoResultsMessage: boolean | undefined;
  errorObtenerCreditos: boolean = false;
 




  constructor( private conexionService: ConexionService,
                private modalController: ModalController,
                private alertController: AlertController) {}

  ngOnInit() {
    this.loadCreditos();
    
  }
  loadCreditos() {
    this.conexionService.getCreditos().subscribe(
      data => {
        this.creditos = data;
        this.filteredCreditos = data;
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
  };
  
  async doRefresh(event: any) {
    this.conexionService.getCreditos().subscribe(
      response => {
        // En caso de éxito, actualiza los créditos y completa el evento de refresco
        this.creditos = response;
        this.filteredCreditos = response;
        event.target.complete();
      },
      async error => {
        // En caso de error, muestra el alerta de error y completa el evento de refresco
        console.error('Error al obtener los créditos:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Sin conexion a la base de datos, intenta nuevamente.',
          buttons: ['OK']
        });
        await alert.present();
        event.target.complete(); // Asegúrate de completar el evento de refresco aquí también
      }
    );
  }

   
async filterCreditos(event: any) {
  this.searchTerm = event.target.value;
  this.searching = true;
  this.showNoResultsMessage = false;


  await this.delay(1000);

  this.filteredCreditos = this.creditos.filter((credito) =>
    credito.productos.toLowerCase().includes(this.searchTerm.toLowerCase())
  );

  this.searching = false;
  this.showNoResultsMessage = this.filteredCreditos.length === 0;
}


  async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


  async openDetalleClienteModal(credito: any) {
    if (this.modalController) {
      const modal = await this.modalController.create({
        component: DetalleClienteModalPage,
        componentProps: {
          detallesCliente: credito
        }
      });
  
      return await modal.present();
    } else {
      console.error('modalController is undefined.');
    }
  }
  
  


}
