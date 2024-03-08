import { Component, OnInit } from '@angular/core';
import { Chart, Color, ScriptableContext } from 'chart.js'; 
import { ConexionService } from '../services/conexion.service';
import { AlertController, AlertOptions, ModalController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AnyObject } from 'chart.js/dist/types/basic';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

ventas!: any[];
datasetColors: string | ((ctx: ScriptableContext<"bar">, options: AnyObject) => Color | undefined) | _DeepPartialObject<CanvasGradient> | _DeepPartialObject<CanvasPattern> | readonly (string | _DeepPartialObject<CanvasGradient> | _DeepPartialObject<CanvasPattern> | undefined)[] | undefined;
ingresosDiarios: {day: string, value: number }[] = [];
ventasPorMes: { mes: string; total: number; totalFormateado: string }[] = [];
days: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
isModalOpen = false;
public mesActual: string | undefined;
  alertController: any;
  
  constructor(
    public modalController: ModalController,
    private router: Router, 
    private conexion: ConexionService,
    private alertCtrl: AlertController,
    private ToastController: ToastController,
    private modalCtrl: ModalController
  ) {}
  
      ngOnInit(): void {
      /*const fechaActual = new Date().toISOString().split('T')[0]; */
        this.conexion.getVentasSemanales().subscribe(
            (data) => {
                this.ventas = data;
                this.ventasPorMes = this.calcularVentasPorMes(data);
                this.generarGrafico();
                this.calculateDailyIncome();
                this.obtenerMesActual();
                
                
            },
            async (error) => {
              console.error('Error al obtener datos de ventas:', error);
      
              // Mostrar alerta con el mensaje de error
              const alertOptions: AlertOptions = {
                header: 'Error',
                subHeader: 'Error al obtener datos de ventas',
                message: 'Hubo un problema al cargar los datos de ventas. Por favor, inténtalo de nuevo.',
                buttons: ['OK'],
              };
            
              const alert = await this.alertController.create(alertOptions);
              await alert.present();
            }
          );
        
    }

    doRefresh(event: any) {
      combineLatest([
        this.conexion.getVentasSemanales(),
        // Otros observables que puedas necesitar
      ]).subscribe(
        ([ventasResponse, /* Otros resultados */]) => {
          this.ventas = ventasResponse;
          this.ventasPorMes = this.calcularVentasPorMes(ventasResponse);
          this.generarGrafico();
          this.calculateDailyIncome();
          this.obtenerMesActual();
          event.target.complete();
        },
        (error) => {
          console.error('Error en la actualización:', error);
          event.target.complete();
        }
      );
    }
          private calculateDailyIncome(): void {
            if (!this.ventas || this.ventas.length === 0) {
              console.log('No hay datos de ventas disponibles.');
              return;
            }

            this.ingresosDiarios = this.calcularIngresosDiarios();
            
            console.log('Ingresos diarios calculados:', this.ingresosDiarios);
          }



      obtenerVentasDiarias(fecha: string): number {
        const ventasDia = this.ventas
          .filter(venta => {
            const fechaVenta = new Date(venta.fecha);
            const fechaVentaString = fechaVenta.toISOString().split('T')[0]; 

            if (typeof venta.total !== 'number') {
              console.error(`Error: el campo total no es un número en la venta con fecha ${venta.fecha}`);
              return false;
            }

            return fechaVentaString === fecha;
          })
          .reduce((total, venta) => total + venta.total, 0);

        return ventasDia;
      }

calcularPorcentajeVentas(): number[] {
    const ventasPorDia: { [key: string]: number } = {};
    const porcentajes: number[] = [];

    const fechaActual = new Date();
    const inicioSemana = new Date(fechaActual);
    inicioSemana.setHours(0, 0, 0, 0);
    const diaSemana = inicioSemana.getDay();

    // Ajusta para que siempre comience desde el lunes
    inicioSemana.setDate(inicioSemana.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1));

    // Ajusta para terminar en el domingo
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);

    for (let i = 0; i < 7; i++) {
        const fechaDia = new Date(inicioSemana);
        fechaDia.setDate(inicioSemana.getDate() + i);
        fechaDia.setHours(0, 0, 0, 0);

        const fechaDiaString = fechaDia.toISOString().split('T')[0];
        const ventasDia = this.obtenerVentasDiarias(fechaDiaString);

        console.log(`Ventas para ${fechaDiaString}: ${ventasDia}`);

        const porcentaje = (ventasDia !== 0) ? (ventasDia / 5000000) * 100 : 0;
        const venta = ventasDia;
        console.log(`Porcentaje para ${fechaDiaString}: ${porcentaje}%`);

        ventasPorDia[fechaDiaString] = ventasDia;
        porcentajes.push(porcentaje);
    }

    console.log('Ventas por día:', ventasPorDia);
    console.log('Porcentajes calculados:', porcentajes);

    return porcentajes;
}

private calcularIngresosDiarios(): { day: string; value: number }[] {
    if (!this.ventas || this.ventas.length === 0) {
        console.log('No hay datos de ventas disponibles.');
        return [];
    }

    const ingresos: { day: string; value: number }[] = [];
    const fechaActual = new Date();
    const inicioSemana = new Date(fechaActual);
    inicioSemana.setHours(0, 0, 0, 0);
    const diaSemana = inicioSemana.getDay();

    // Ajusta para que siempre comience desde el lunes de la semana actual
    inicioSemana.setDate(inicioSemana.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1));

    // Ajusta para terminar en el domingo de la semana actual
    const finSemana = new Date(inicioSemana);
    finSemana.setDate(inicioSemana.getDate() + 6);

    for (let i = 0; i < 7; i++) {
        const fechaDia = new Date(inicioSemana);
        fechaDia.setDate(inicioSemana.getDate() + i);
        fechaDia.setHours(0, 0, 0, 0);

        // Verifica que la fecha esté dentro de la semana actual
        if (fechaDia <= finSemana) {
            const fechaDiaString = fechaDia.toISOString().split('T')[0];
            const ventasDia = this.obtenerVentasDiarias(fechaDiaString);

            console.log(`Ventas para ${fechaDiaString}: ${ventasDia}`);

            const nombreDia = this.days[(fechaDia.getDay() + 6) % 7]; // Ajuste del índice

            ingresos.push({ day: nombreDia, value: ventasDia });
        }
    }

    return ingresos;
}



generarGrafico() {
  const canvas = document.getElementById('myChart') as HTMLCanvasElement | null;
  const ctx = canvas?.getContext('2d');

  // Verifica si ya hay un gráfico existente
  const existingChart = ctx ? Chart.getChart(ctx) : null;

  if (existingChart) {
    // Destruye el gráfico existente antes de crear uno nuevo
    existingChart.destroy();
  }

  if (ctx) {
    const datasetColors = [
      'rgba(2, 70, 105, 10)',
      'rgba(3, 90, 143, 10)',
      'rgba(39, 135, 183, 10)',
      'rgba(104, 179, 218, 10)',
      'rgba(174, 211, 229, 10)',
      'rgba(219, 234, 241, 10)'
    ];

    const porcentajesVentas = this.calcularPorcentajeVentas();

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.days,
        datasets: [
          {
            label: "Ingresos (%)",
            data: porcentajesVentas,
            backgroundColor: datasetColors,
            borderColor: datasetColors,
            borderWidth: 1
          },
        ]
      },
      options: {
        plugins: {
          legend: {
            display: true,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  } else {
    console.error('No se pudo obtener el contexto del lienzo (canvas).');
  }
}


    getBackgroundColor(index: number): string {
      const datasetColors = [
        'rgba(2, 70, 105, 10)',
        'rgba(3, 90, 143, 10)',
        'rgba(39, 135, 183, 10)',
        'rgba(104, 179, 218, 10)',
        'rgba(174, 211, 229, 10)',
        'rgba(219, 234, 241, 10)'
      ];

      return datasetColors[index];
    }

    calcularVentasPorMes(ventas: any[]): { mes: string; total: number; totalFormateado: string }[] {
      let ventasPorMes: { [key: string]: number } = {};
      const formatoColombiano = {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      };
    
      ventas.forEach(venta => {
        const mes = new Date(venta.fecha).toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!ventasPorMes[mes]) {
          ventasPorMes[mes] = 0;
        }
        ventasPorMes[mes] += venta.total;
      });
    
      return Object.keys(ventasPorMes).map(mes => ({
        mes,
        total: ventasPorMes[mes],
        totalFormateado: ventasPorMes[mes].toLocaleString('es-CO', formatoColombiano)
      }));
    }
    
    


  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
  }

      obtenerMesActual() {
        const fechaActual = new Date();
        const opciones: Intl.DateTimeFormatOptions = { month: 'long' }; // Corregido el tipo de opciones
        this.mesActual = new Intl.DateTimeFormat('es', opciones).format(fechaActual);
      }
  

}
