import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {TipoUsuario} from '../../model/TipoUsuario';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class TipoUsuarioService {
  private baseUrl = `${environment.baseURL}/v1/tipo-usuarios`;

  constructor(private http: HttpClient) {
  }

  getTipoUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}` + '/');
  }

  getTipoUsuariosById(tipoUsuarioId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}` + `/${tipoUsuarioId}`);
  }

  saveTipoUsuario(tipoUsuario: TipoUsuario): Observable<any> {
    return this.http.post(`${this.baseUrl}` + `/`, tipoUsuario);
  }

  updateTipoUsuario(tipoUsuario: TipoUsuario): Observable<any> {
    return this.http.put(`${this.baseUrl}`, tipoUsuario);
  }

  deleteTipoUsuarioById(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}` + `/${id}`);
  }

}
