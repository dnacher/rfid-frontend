import { Component, OnInit } from '@angular/core';
import {ApiService} from '../../../service/api.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public apiService: ApiService;

  public menuPrincipal;
  public menuSeguridad;
  public menuConfiguracion;
  public menuEstados;
  userImage = 'assets/user.png';

  public itemConfiguracion = new PaginaItem('Configuración', null, 'Configuracion', true);
  public itemSeguridad = new PaginaItem('Seguridad', null, 'Seguridad', true);

  public menuActual;
  public carpetaActual = 'Principal';

  constructor(apiService: ApiService) {
    this.apiService = apiService;
  }

  test(value: PaginaItem) {
    if (value.esCarpeta) {
      this.carpetaActual = value.carpeta;
    }
    switch (this.carpetaActual) {
      case 'Principal':
        console.log('menu Principal');
        this.menuActual = this.menuPrincipal;
        break;
      case 'Seguridad':
        console.log('menu Seguridad');
        this.menuActual = this.menuSeguridad;
        break;
      case 'Configuracion':
        this.menuActual = this.menuConfiguracion;
        break;
      case 'Estado':
        this.menuActual = this.menuEstados;
        break;
    }

  }

  ngOnInit() {
    this.menuPrincipal = [
      new PaginaItem('Inicio', '/asistencia', 'Principal', true),
      new PaginaItem('Asistencia', '/asistencia', 'Principal', false),
    ];
    this.menuSeguridad = [
      new PaginaItem('Inicio', '/dashboard', 'Principal', true),
      new PaginaItem('Usuario', '/usuario', '', false),
      new PaginaItem('Tipo de Usuario', '/tipo-usuario', '', false),
      new PaginaItem('Permisos', '/permisos', '', false),
    ];
    this.menuConfiguracion = [
      new PaginaItem('Inicio', '/dashboard', 'Principal', true),
      new PaginaItem('Banco', '/bancos', '', false),
      new PaginaItem('Compañias', '/companias', '', false),
      new PaginaItem('Cotizacion Vendedores', '/cotizacion-vendedores', '', false),
      new PaginaItem('Estados', '', 'Estado', true),
      new PaginaItem('Forma de pago', '/forma-pago', '', false),
      new PaginaItem('Moneda', '/moneda', '', false),
      new PaginaItem('Productos', '/producto', '', false),
      new PaginaItem('Tipo Productos', '/tipo-producto', '', false),
      new PaginaItem('Vendedores', '/vendedor', '', false),
    ];
    this.menuEstados = [
      new PaginaItem('Inicio', '/dashboard', 'Principal', true),
      new PaginaItem('Estado Siniestro', '/estado-siniestro', '', false),
      new PaginaItem('Estado Poliza', '/estado-poliza', '', false),
    ];
    this.menuActual = this.menuPrincipal;
  }

}

class PaginaItem {
  tituloMenu: string;
  routerLink: string;
  carpeta: string;
  esCarpeta: boolean;

  constructor(tituloMenu: string, routerLink: string, carpeta: string, esCarpeta: boolean) {
    this.tituloMenu = tituloMenu;
    this.routerLink = routerLink;
    this.carpeta = carpeta;
    this.esCarpeta = esCarpeta;
  }
}
