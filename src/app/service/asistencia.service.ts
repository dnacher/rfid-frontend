import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Asistencia} from '../model/Asistencia';
import {Curso} from '../model/Curso';
import {formatDate} from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class AsistenciaService {
  private baseUrl = `${environment.baseURL}/v1/asistencias`;

  constructor(private http: HttpClient) {
  }

  getAsistenciasByFechaAndCurso(cursoId: Curso, fecha: Date): Observable<any> {
    const uri = this.baseUrl + '/curso/' + cursoId + '?fecha=' + fecha.toISOString().split('T')[0];
    console.log(uri);
    return this.http.get(uri);
  }

  getAsistenciaByAlumno(): Observable<any> {
    console.log(this.baseUrl);
    return this.http.get(`${this.baseUrl}` + '/alumno');
  }

  getAsistenciaByCursoId(cursoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}` + `/curso/${cursoId}`);
  }

  getNoAsistenByCursoAndFecha(cursoId, fecha): Observable<any> {
    const fechaFormateada = formatDate(fecha, 'yyyy-MM-dd', 'en-US');
    return this.http.get(`${this.baseUrl}` + `/no_asisten/${cursoId}?fecha=` + fechaFormateada);
  }

  getAsistenciaById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  saveAsistencia(uid: string): Observable<any> {
    const paramsList = new HttpParams().set('uid', uid);
    return this.http.post(`${this.baseUrl}`, {params: paramsList});
  }

  updateAsistencia(asistencia: Asistencia): Observable<any> {
    return this.http.put(`${this.baseUrl}`, asistencia);
  }

}
