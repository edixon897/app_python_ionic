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

  private baseUrl = "http://127.0.0.1:80"; // URL del backend PHP


  constructor(private http: HttpClient) { }

  verificarCedula(cedula: string, password: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getUsrId/${cedula}/${password}`);
  };

  getVentasSemanales(): Observable<any> {
    return this.http
    .get<any>(`${this.baseUrl}/ventasSemanales`)
    .pipe(tap(() =>{
      this._refresh$?.next()
    }))
  };

  

  getCreditos(): Observable<any> {
    return this.http.get(this.baseUrl+"/creditos").pipe(tap(() =>{
      this._refresh$?.next()
    }))
  };

  getProductos(): Observable<any> {
    return this.http.get(this.baseUrl + '/productosget').pipe(
      tap(() => this._refresh$.next())
    );
  }

  getproveedores(): Observable<any> {
    return this.http.get(this.baseUrl + '/proveedor').pipe(
      tap(() => this._refresh$.next())
    );
  }
}


  

  