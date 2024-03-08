import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalleClienteModalPage } from './detalle-cliente-modal.page';

describe('DetalleClienteModalPage', () => {
  let component: DetalleClienteModalPage;
  let fixture: ComponentFixture<DetalleClienteModalPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetalleClienteModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
