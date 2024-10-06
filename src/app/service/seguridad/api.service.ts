import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {UsuarioService} from './usuario.service';
import {Credentials} from '../../model/Credentials';
import {CambiarUsuarioService} from './cambiar.usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public user: string;
  public userType: string;
  public imagen: string;

  constructor(private http: HttpClient,
              private usarioService: UsuarioService,
              private cambiarUsaurioService: CambiarUsuarioService) {
    this.user = localStorage.getItem('usuarioNombre');
    this.userType = localStorage.getItem('tipoUsuario');
    this.imagen = localStorage.getItem('imagen');
    this.cambiarUsaurioService.imagen$.subscribe((imagen) => {
      this.imagen = imagen;
    });
  }

  login(creds: Credentials) {
    return this.http.post(`${environment.base}/login`, creds, {
      observe: 'response'
    }).pipe(map((response: HttpResponse<any>) => {
      const body = response.body;
      const headers = response.headers;

      // tslint:disable-next-line:no-non-null-assertion
      const bearerToken = headers.get('Authorization')!;
      const token = bearerToken.replace('Bearer ', '');
      localStorage.setItem('token', token);

      this.usarioService.getUsuariosByNombre(creds.email).subscribe({
        next: (res) => {
          localStorage.setItem('usuarioNombre', res.message.nombre);
          localStorage.setItem('tipoUsuario', res.message.tipoUsuario.nombre);
          localStorage.setItem('tipoUsuarioId', res.message.tipoUsuario.id);
          const defaultUserImage = 'assets/usuarios/user.png';
          console.log(res.message);
          const userImage = res.message.imagen ? 'assets/usuarios/' + res.message.imagen : defaultUserImage;
          localStorage.setItem('imagen', userImage);
          this.cambiarUsaurioService.cambiarUsuario(res.message.tipoUsuario.id);
          this.cambiarUsaurioService.cambiarImagen(userImage);
          this.user = res.message.nombre;
          this.userType = res.message.tipoUsuario.nombre;
        },
        error: console.log,
      });
      return body;
    }));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('imagen');
    this.user = '';
    this.userType = '';
    this.cambiarUsaurioService.cambiarUsuario(null);
    this.cambiarUsaurioService.cambiarImagen(null);
  }
}
