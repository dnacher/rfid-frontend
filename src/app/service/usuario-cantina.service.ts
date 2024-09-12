import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {UsuarioCantina} from '../model/UsuarioCantina';

@Injectable({
  providedIn: 'root'
})

export class UsuarioCantinaService {

  private baseUrl = `${environment.baseURL}/v1/usuario-cantinas`;

  constructor(private http: HttpClient) {
  }

  getUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getUsuarioByAlumnoId(alumnoId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/alumno/${alumnoId}`);
  }

  getUsuarioById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  saveUsuarioByUidWith0Saldo(uid: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/uid/${uid}`, {});
  }

  getUsuarioByUid(uid: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/uid/${uid}`, {});
  }

  saveUsuario(usuarioCantina: UsuarioCantina): Observable<any> {
    return this.http.post(`${this.baseUrl}`, usuarioCantina);
  }

  updateUsuario(usuarioCantina: UsuarioCantina): Observable<any> {
    return this.http.put(`${this.baseUrl}`, usuarioCantina);
  }

  cargarSaldo(uid: string, saldoACargar: number, observaciones: string): Observable<any> {
    if (!observaciones) {
      return this.http.post(`${this.baseUrl}/cargar/${uid}/saldo/${saldoACargar}`, {});
    } else {
      return this.http.post(`${this.baseUrl}/cargar/${uid}/saldo/${saldoACargar}?observaciones=${observaciones}`, {});
    }
  }

  deleteInventario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {responseType: 'text'});
  }

}
