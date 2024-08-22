import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

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

}
