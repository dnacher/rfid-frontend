import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {PermisoUsuario} from '../../model/PermisoUsuario';
import {AppConfig} from '../../model/AppConfig';

@Injectable({
  providedIn: 'root'
})

export class PermisoUsuarioService {
  private baseUrl = `${environment.baseURL}/v1/permiso-usuarios`;

  constructor(private http: HttpClient) {
  }

  getPermisoUsuarios(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getPermisoUsuariosById(permisoUsuarioId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}` + `/${permisoUsuarioId}`);
  }

  getPermisoUsuariosByTipoUsuarioId(tipoUsuarioId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}` + `/tipo-usuario/${tipoUsuarioId}`);
  }

  getPaginaItemsByTipoUsuarioId(tipoUsuarioId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}` + `/pagina-item/tipo-usuario/${tipoUsuarioId}`);
  }

  savePermisoUsuario(permisoUsuario: PermisoUsuario): Observable<any> {
    return this.http.post(`${this.baseUrl}`, permisoUsuario);
  }

  savePermisoUsuarios(permisoUsuarios: PermisoUsuario[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/permisos`, permisoUsuarios);
  }

  deletePermisoUsuarioById(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}` + `/${id}`);
  }

  updatePermisoUsuario(id: number, permisoUsuario: PermisoUsuario): Observable<any> {
    return this.http.put(`${this.baseUrl}`, permisoUsuario);
  }

  getAppConfig(): Observable<any> {
    return this.http.get(`${environment.base}/api/v1/app-config`);
  }

  getAppConfigByApiKey(configKey: string): Observable<any> {
    return this.http.get(`${environment.base}/api/v1/app-config/config-key/${configKey}`);
  }

  saveAppConfig(appConfig: AppConfig): Observable<any> {
    return this.http.post(`${environment.base}/api/v1/app-config`, appConfig);
  }

  updateAppConfig(appConfig: AppConfig): Observable<any> {
    return this.http.put(`${environment.base}/api/v1/app-config`, appConfig);
  }

  deleteAppConfigById(id: number): Observable<any> {
    return this.http.delete(`${environment.base}/api/v1/app-config` + `/${id}`);
  }

}
