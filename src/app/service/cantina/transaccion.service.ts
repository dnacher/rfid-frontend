import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Transaccion} from '../../model/Transaccion';

@Injectable({
  providedIn: 'root'
})

export class TransaccionService {

  private baseUrl = `${environment.baseURL}/v1/transacciones`;

  constructor(private http: HttpClient) {
  }

  saveTransaccion(transaccion: Transaccion): Observable<any> {
    return this.http.post(`${this.baseUrl}`, transaccion);
  }

  cancelTransaccion(uuid: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/cancel/${uuid}`, {});
  }

  findByUuid(uuid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/uuid/${uuid}`,{});
  }

  findByUidCard(uid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/uid-card/${uid}`,{});
  }

  findByUsuarioCantinaAlumnoUidCardByFechas(uid: string, fechaInicio:string, fechaFin:string): Observable<any> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get(`${this.baseUrl}/uid-card/${uid}/fechas/`, {params});
  }
}
