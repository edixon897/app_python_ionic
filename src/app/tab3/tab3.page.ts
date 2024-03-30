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
topProductos: any[] = [];
ventas!: any[];
datasetColors: string | ((ctx: ScriptableContext<"bar">, options: AnyObject) => Color | undefined) | _DeepPartialObject<CanvasGradient> | _DeepPartialObject<CanvasPattern> | readonly (string | _DeepPartialObject<CanvasGradient> | _DeepPartialObject<CanvasPattern> | undefined)[] | undefined;
ingresosDiarios: {day: string, value: number }[] = [];
ventasPorMes: { mes: string; total: number; totalFormateado: string }[] = [];
days: string[] = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
isModalOpen = false;
isModalOpenTop = false;
mesesConVentas: string[] = [];

public mesActual: string | undefined;
  
  constructor(
    public modalController: ModalController,
    private router: Router,
    private conexion: ConexionService,
    private alertCtrl: AlertController,
    private ToastController: ToastController,
    private alertController: AlertController
  ) {}
  
      ngOnInit(): void {
        this.conexion.getVentasSemanales().subscribe(
            (data) => {
                this.ventas = data;
                console.log("este es ventas",this.ventas);
                /* this.ventasPorMes = this.calcularVentasPorMes(data); */
                this.generarGrafico();
                this.calculateDailyIncome();
                this.calcularTopProductos();
                this.calcularVentasPorMes(this.ventas);
                this.obtenerMesesConVentas(this.ventas);
                this. obtenerMesActual();
                
                
                
            },
            async (error) => {
              console.error('Error al obtener datos de ventas:', error);
      
              // Mostrar alerta con el mensaje de error
              const alertOptions: AlertOptions = {
                header: 'Error',
                message: 'Sin conexion ha internet, intenta nuevamente.',
                buttons: ['OK'],
              };
            
              const alert = await this.alertController.create(alertOptions);
              await alert.present();
            }
          );
        
    }



    /* REFERESCA LA PAGINA */
    async doRefresh(event: any) {
      combineLatest([
        this.conexion.getVentasSemanales(),
          ]).subscribe(
            async ([ventasResponse]) => {
              this.ventas = ventasResponse;
              /* this.ventasPorMes = this.calcularVentasPorMes(ventasResponse); */
              this.generarGrafico();
              this.calculateDailyIncome();
              this.calcularTopProductos();
              this.calcularVentasPorMes(this.ventas);
              this.obtenerMesesConVentas(this.ventas);
              event.target.complete();
            },
            async error => {
              // En caso de error, muestra el alerta de error y completa el evento de refresco
              console.error('Error al obtener los créditos:', error);
              const alert = await this.alertController.create({
                header: 'Error',
                message: 'Sin conexion a la base de datos, intenta de nuevamente',
                buttons: ['OK']
              });
              await alert.present();
              event.target.complete(); 
            }
          );
    }

          /* OBTENER DATOS CALCULADOS DE INGRESOS DIARIOS */
          private calculateDailyIncome(): void {
            if (!this.ventas || this.ventas.length === 0) {
              console.log('No hay datos de ventas disponibles.');
              return;
            }

            this.ingresosDiarios = this.calcularIngresosDiarios();
            
            console.log('Ingresos diarios calculados:', this.ingresosDiarios);
          }


          /* vENTAS DIARIAS */
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


      /* CALCULAR PORCENTAJES DE VENTAS  */
    calcularPorcentajeVentas(): number[] {
        const ventasPorDia: { [key: string]: number } = {};
        const porcentajes: number[] = [];

        const fechaActual = new Date();
        const inicioSemana = new Date(fechaActual);
        inicioSemana.setHours(0, 0, 0, 0);
        const diaSemana = inicioSemana.getDay();

        // Ajusto para que siempre comience desde el lunes
        inicioSemana.setDate(inicioSemana.getDate() - diaSemana + (diaSemana === 0 ? -6 : 1));

        // Ajusto para terminar en el domingo
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

    


      /* CALCULAR INGRESOS DIARIOS */
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


        /* GENERAR GREFICO DE VENTAS POR SEMANA */
        generarGrafico() {
          const canvas = document.getElementById('myChart') as HTMLCanvasElement | null;
          const ctx = canvas?.getContext('2d');

          // Verifico si ya hay un gráfico existente
          const existingChart = ctx ? Chart.getChart(ctx) : null;

          if (existingChart) {
            // Destruyo el gráfico existente antes de crear uno nuevo
            existingChart.destroy();
          }

          if (ctx) {
            const datasetColors = [
              'rgba(53, 140, 180, 71)',
              'rgba(53, 140, 180, 71)',
              'rgba(53, 140, 180, 71)',
              'rgba(53, 140, 180, 71)',
              'rgba(53, 140, 180, 71)',
              'rgba(53, 140, 180, 71)'
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
        'rgba()',
        'rgba()',
        'rgba()',
        'rgba()',
        'rgba()',
        'rgba()'
      ];

      return datasetColors[index];
    }



    calcularVentasPorMes(ventas: any[]): void {
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
  
      this.ventasPorMes = Object.keys(ventasPorMes).map(mes => ({
        mes,
        total: ventasPorMes[mes],
        totalFormateado: ventasPorMes[mes].toLocaleString('es-CO', formatoColombiano)
      }));
    }
  
    obtenerMesesConVentas(ventas: any[]): void {
      const mesesSet = new Set<string>();
      ventas.forEach(venta => {
        const mes = new Date(venta.fecha).toLocaleString('default', { month: 'long', year: 'numeric' });
        mesesSet.add(mes);
      });
      this.mesesConVentas = Array.from(mesesSet);
    }
  
    obtenerTotalPorMes(mes: string): string {
      const ventaMes = this.ventasPorMes.find(venta => venta.mes === mes);
      return ventaMes ? ventaMes.totalFormateado : '0';
    }
  
    mesSeleccionado: string = '';
    
    

    /* MODAL TOTAL DEVENTAS MENSALUES */
    setOpen(isOpen: boolean) {
      this.isModalOpen = isOpen;
    }

      /* MODAL TOP DE VENTAS */
    setOpenTop(isOpen: boolean) {
      this.isModalOpenTop = isOpen;
    }



      /* OBTENER MES ACTUAL */
      obtenerMesActual() {
        const fechaActual = new Date();
        const opciones: Intl.DateTimeFormatOptions = { month: 'long' };
        this.mesActual = new Intl.DateTimeFormat('es', opciones).format(fechaActual);
      }






     /* TOP DE PRODUCTOS */
      calcularTopProductos() {
        // Obtener el mes actual
        const mesActual = new Date().toLocaleString('default', { month: 'long' });

        // Filtrar las ventas por el mes actual
        const ventasMes = this.ventas.filter(venta => {
          const mesVenta = new Date(venta.fecha).toLocaleString('default', { month: 'long' });
          return mesVenta === mesActual;
        });

        // Verificar si hay ventas para el mes actual
        if (ventasMes.length > 0) {
          
          this.topProductos = this.calcularTop10Productos(ventasMes);
          console.log('Top de productos para el mes actual:', this.topProductos);
        } else {
          console.log('No hay ventas registradas para el mes actual');
          this.topProductos = [];
        }
      }



        /* CALCULO DE TOP DE PRODUCTO */
        calcularTop10Productos(ventasSemana: any[]): any[] {
          ventasSemana.sort((a, b) => b.cantidad_productos_factura - a.cantidad_productos_factura);
          return ventasSemana.slice(0, 10);
        }
        
    
}





