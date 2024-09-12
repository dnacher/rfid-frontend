import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class HistorialService {

  private baseUrl = `${environment.baseURL}/v1/historial`;

  constructor(private http: HttpClient) {
  }

  findByUsuarioCantinaAlumnoUidCard(uid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/uid/${uid}`);
  }

  findByUsuarioCantinaAlumnoUidCardByFechas(uid: string, fechaInicio:string, fechaFin:string): Observable<any> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFin', fechaFin);
    return this.http.get(`${this.baseUrl}/uid-card/${uid}`, {params});
  }
}
