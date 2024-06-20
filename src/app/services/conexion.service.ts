import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConexionService {

  private _refresh$ = new Subject<void>()

  get refresh$(){
    return this._refresh$
  }

  private baseUrl = "http://192.168.0.105:5080"; // URL del backend PHP


  constructor(private http: HttpClient) { }

  verificarCedula(cedula: string, password: string): Observable<any> {
    const headers = ['Content-Type', 'application/json'];
    return this.http.get(`${this.baseUrl}/getUsrId/${cedula}/${password}`);
  };

  getVentasSemanales(): Observable<any> {
    const headers = ['Content-Type', 'application/json'];
    return this.http
    .get<any>(`${this.baseUrl}/ventasSemanales`)
    .pipe(tap(() =>{
      this._refresh$?.next()
    }))
  };

  

  getCreditos(): Observable<any> {
    const headers = ['Content-Type', 'application/json'];
    return this.http.get(this.baseUrl+"/creditos").pipe(tap(() =>{
      this._refresh$?.next()
    }))
  };

  getProductos(): Observable<any> {
    const headers = ['Content-Type', 'application/json'];
    return this.http.get(this.baseUrl + '/productosget').pipe(
      tap(() => this._refresh$.next())
    );
  }

  // Nuevo método para obtener información del proveedor por su nombre
  getProveedor(nomProveedor: string): Observable<any> {
    const headers = ['Content-Type', 'application/json'];
    return this.http.get(`${this.baseUrl}/getProveedor/${nomProveedor}`);
  }
}


  

  