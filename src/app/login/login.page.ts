import { Component, OnInit } from '@angular/core';
import { ConexionService } from '../services/conexion.service';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  cedula!: string;
  password!: string;
  
  constructor(private router: Router,
    private conexion: ConexionService,
    private alertCtrl: AlertController,
    private ToastController: ToastController,
    private modalCtrl: ModalController ) { }

  ngOnInit() {
  }


  goToTab1() {
    if (this.cedula && this.password) { // Verifica que tanto la cédula como la contraseña estén presentes
      this.conexion.verificarCedula(this.cedula, this.password).subscribe(
        (response) => {
          console.log(response);
          if (response.resp === 'existe') {
            this.router.navigateByUrl('/tabss/tabs/tab1');
            console.log("muy bien")
          } else if (response.resp === 'no_existe') {
            console.log("mal mal")
            this.presentToast()
          } else {
            // Ocurrió un error en la consulta
          }
        },
        (error) => {
          console.error('Error al verificar cédula:', error);
          // Maneja el error como necesites
        }
      );
    } else {
      console.error('Por favor, ingresa la cédula y la contraseña');
      // Puedes mostrar un mensaje al usuario indicando que debe ingresar la cédula y la contraseña
    }
  }
  
  async presentToast() {
    const toast = await this.ToastController.create({
      message: "Error al verificar usuario",
      duration: 2000
    });
    toast.present();
  }




  
  /* goToTab1() {
    this.router.navigateByUrl('/tabss/tabs/tab1');
  } */
}