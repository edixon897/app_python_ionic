import { Component,ElementRef, Renderer2  } from '@angular/core';
import { ConexionService } from '../services/conexion.service';
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
  detallesCliente: any;
  fondo_modal: boolean = false;
  ;
 




  constructor( private conexionService: ConexionService,
                private modalController: ModalController,
                private alertController: AlertController,
                private elRef: ElementRef, private renderer: Renderer2) {}

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



    
  
  openDetalleClienteModal(credito: any) {
    this.detallesCliente = credito;
    this.fondo_modal = true;
    console.log("Modal abierto. Detalles del cliente:", this.detallesCliente);
    console.log("fondo_modal:", this.fondo_modal);
  
    const fondo_modal = this.elRef.nativeElement.querySelector('#fondo_modal');
    const modal = this.elRef.nativeElement.querySelector('#modal');
  
    if (fondo_modal && modal) {
      this.renderer.setStyle(fondo_modal, 'display', 'block');
  
      setTimeout(() => {
        if (fondo_modal) {
          this.renderer.setStyle(fondo_modal, 'backgroundColor', 'rgba(88, 88, 88, 0.56)');
        }
      }, 200);
  
      this.renderer.setStyle(modal, 'display', 'block');
  
      setTimeout(() => {
        if (modal) {
          this.renderer.setStyle(modal, 'opacity', '1');
        }
      }, 400);
    }
  }
  

  cerrarModal() {
    this.fondo_modal = false;
    console.log("Modal cerrado");
  
    const fondo_modal = this.elRef.nativeElement.querySelector('#fondo_modal');
    const modal = this.elRef.nativeElement.querySelector('#modal');
  
    if (fondo_modal && modal) {
      setTimeout(() => {
        if (modal) {
          this.renderer.setStyle(modal, 'opacity', '0');
        }
      }, 200);
  
      setTimeout(() => {
        if (modal) {
          this.renderer.setStyle(modal, 'display', 'none');
        }
      }, 380);
  
      setTimeout(() => {
        if (fondo_modal) {
          this.renderer.setStyle(fondo_modal, 'backgroundColor', 'rgba(88, 88, 88, 0)');
        }
      }, 400);
  
      setTimeout(() => {
        if (fondo_modal) {
          this.renderer.setStyle(fondo_modal, 'display', 'none');
        }
      }, 580);
    }
  }
  

  detener_Propagacion(event: Event) {
    event.stopPropagation();
  }

  
  
  


}
