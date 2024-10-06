import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Usuario} from '../../model/Usuario';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {
  private baseUrl = `${environment.baseURL}/v1/usuarios`;

  constructor(private http: HttpClient) {
  }

  getUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}` + '/');
  }

  getUsuariosById(usuarioId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}` + `/${usuarioId}`);
  }

  getUsuariosByNombre(usuarioNombre: string): Observable<any> {
    return this.http.get(`${this.baseUrl}` + `/nombre/${usuarioNombre}`);
  }

  saveUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.baseUrl}`, usuario);
  }

  deleteUsuarioById(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}` + `/${id}`);
  }

  updateUsuario(usuario: Usuario): Observable<any> {
    return this.http.put(`${this.baseUrl}`, usuario);
  }

  saveUsuarioWithImagen(usuario: Usuario, file: File): Observable<any> {
    const formData: FormData = new FormData();

    // Agregar el objeto usuario al FormData como JSON string
    formData.append('usuario', JSON.stringify(usuario));

    // Agregar el archivo
    formData.append('file', file);
    console.log(formData);
    // Enviar la solicitud POST con el FormData
    return this.http.post<any>(`${this.baseUrl}/imagen`, formData);
  }

}
