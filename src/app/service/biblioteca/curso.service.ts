import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Curso} from '../../model/Curso';

@Injectable({
  providedIn: 'root'
})

export class CursoService {

  private baseUrl = `${environment.baseURL}/v1/cursos`;

  constructor(private http: HttpClient) {
  }

  getCursos(): Observable<any> {
    console.log(this.baseUrl);
    return this.http.get(`${this.baseUrl}`);
  }

  getCursoById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  saveCurso(curso: Curso): Observable<any> {
    return this.http.post(`${this.baseUrl}`, curso);
  }

  updateCurso(curso: Curso): Observable<any> {
    return this.http.put(`${this.baseUrl}`, curso);
  }

  deleteCurso(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

}
