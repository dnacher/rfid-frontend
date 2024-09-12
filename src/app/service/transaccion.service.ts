import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Transaccion} from '../model/Transaccion';

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

}
