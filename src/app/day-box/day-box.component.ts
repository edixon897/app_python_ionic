// day-box.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-day-box',
  templateUrl: './day-box.component.html',
  styleUrls: ['./day-box.component.scss']
})
export class DayBoxComponent implements OnInit {
  @Input() day!: string;
  @Input() value!: number;
  @Input() backgroundColor!: string;

  formattedValue: string = '';

  constructor() {}

  ngOnInit(): void {
    this.formattedValue = this.formatMoney(this.value);
  }
  
  private formatMoney(value: number): string {
    const formattedValue = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  
    return formattedValue;
  }
  
}
