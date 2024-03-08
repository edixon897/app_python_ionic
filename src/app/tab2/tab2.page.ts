import { Component } from '@angular/core';
import { ConexionService } from '../services/conexion.service';
import { DetalleClienteModalPage } from './detalle-cliente-modal/detalle-cliente-modal.page';
import { ModalController } from '@ionic/angular';






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




  constructor( private conexionService: ConexionService,
                private modalController: ModalController) {}

  ngOnInit() {
    this.loadCreditos();
    
  }
  loadCreditos() {
    this.conexionService.getCreditos().subscribe(
      data => {
        this.creditos = data;
        this.filteredCreditos = data;
      },
      (error) => {
        console.error('Error en la búsqueda:', error);
        this.errorBusqueda = true;  // Activa el indicador de error
      }
    )
  };

  doRefresh(event: any){
    this.conexionService.getCreditos().subscribe(
      response => {
        this.creditos = response
        this.filteredCreditos = response;
        event.target.complete();
      }
    )
  }

   // En tu componente TypeScript
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
