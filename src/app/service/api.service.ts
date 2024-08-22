import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  public user: string;
  public userType: string;
  public pic: string;

  constructor(private http: HttpClient) {
    this.user = localStorage.getItem('usuarioNombre');
    this.userType = localStorage.getItem('tipoUsuario');
    this.pic = localStorage.getItem('pic');
  }

  login() {
    // return this.http.post(`${environment.base}/login`, creds, {
    //   observe: 'response'
    // }).pipe(map((response: HttpResponse<any>) => {
    //   const body = response.body;
    //   const headers = response.headers;
    //
    //   // tslint:disable-next-line:no-non-null-assertion
    //   const bearerToken = headers.get('Authorization')!;
    //   const token = bearerToken.replace('Bearer ', '');
    //   localStorage.setItem('token', token);
    //
    //   this.usarioService.getUsuariosByNombre(creds.email).subscribe({
    //     next: (res) => {
    //       localStorage.setItem('usuarioNombre', res.nombre);
    //       localStorage.setItem('tipoUsuario', res.tipoUsuario.nombre);
    //       localStorage.setItem('pic', 'shiba2.jpg');
    //       this.user = res.nombre;
    //       this.userType = res.tipoUsuario.nombre;
    //     },
    //     error: console.log,
    //   });
    //   return body;
    // }));
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('tipoUsuario');
    localStorage.removeItem('pic');
    this.user = '';
    this.userType = '';
  }
}
