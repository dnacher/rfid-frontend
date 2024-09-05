import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Prestamo} from '../model/Prestamo';

@Injectable({
  providedIn: 'root'
})

export class PrestamoService {

  private baseUrl = `${environment.baseURL}/v1/prestamos`;

  constructor(private http: HttpClient) {
  }

  getPrestamos(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getPrestamoByAlumno(alumnoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/alumno/${alumnoId}`);
  }

  getPrestamoByUid(uid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/uid/${uid}`);
  }

  getPrestamoNoDevueltos(): Observable<any> {
    return this.http.get(`${this.baseUrl}/no-devueltos`);
  }

  getHistorialByUid(uid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/historial/uid/${uid}`);
  }

  findPrestamosByFecha(cursoId: number, fechaInicio: string, fechaFinal:string): Observable<any> {
    const params = new HttpParams()
      .set('fechaInicio', fechaInicio)
      .set('fechaFinal', fechaFinal);
    return this.http.get(`${this.baseUrl}/curso/${cursoId}`, { params });
  }

  getPrestamosById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  savePrestamo(prestamo: Prestamo): Observable<any> {
    return this.http.post(`${this.baseUrl}`, prestamo);
  }

  devolverPrestamo(prestamo: Prestamo): Observable<any> {
    return this.http.put(`${this.baseUrl}/devolver`, prestamo);
  }

  updatePrestamo(prestamo: Prestamo): Observable<any> {
    return this.http.put(`${this.baseUrl}`, prestamo);
  }

  deletePrestamo(id: number) {
    this.http.delete(`${this.baseUrl}/${id}`)
  }
}
