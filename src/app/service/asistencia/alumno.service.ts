import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Alumno} from '../../model/Alumno';

@Injectable({
  providedIn: 'root'
})

export class AlumnoService {

  private baseUrl = `${environment.baseURL}/v1/alumnos`;

  constructor(private http: HttpClient) {
  }

  getAlumnos(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getAlumnosById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getAlumnoByCursoId(cursoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/curso/${cursoId}`);
  }

  getAlumnosByUid(uid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/uid/${uid}`);
  }

  saveAlumno(alumno: Alumno): Observable<any> {
    return this.http.post(`${this.baseUrl}`, alumno);
  }

  saveAlumnos(alumnos: Alumno[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/alumnos`, alumnos);
  }

  updateAlumno(alumno: Alumno): Observable<any> {
    return this.http.put(`${this.baseUrl}`, alumno);
  }

  deleteAlumno(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

}
