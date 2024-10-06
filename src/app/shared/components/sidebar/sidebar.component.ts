import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../service/seguridad/api.service';
import {PaginaItem} from '../../../model/PaginaItem';
import {PermisoUsuarioService} from '../../../service/seguridad/permisoUsuario.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {CambiarUsuarioService} from '../../../service/seguridad/cambiar.usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public apiService: ApiService;

  public menuPrincipal = [];
  public menuAsistencia = [];
  public menuBiblioteca = [];
  public menuCantina = [];
  public menuSeguridad = [];
  public menuConfiguracion = [];
  public listaItems: PaginaItem[] = [];
  private usuarioSub: Subscription;
  private imagenSub: Subscription;
  public imagen;
  public tienePermisoSeguridad = false;
  public verMenu = false;
  public verImagen = false;

  public itemConfiguracion = new PaginaItem(null, null, 'Configuración', null, 'Configuracion', true);
  public itemSeguridad = new PaginaItem(null, null, 'Seguridad', null, 'Seguridad', true);

  public menuActual;
  public carpetaActual = 'Principal';

  constructor(apiService: ApiService,
              private permisoUsaurioService: PermisoUsuarioService,
              private router: Router,
              private cambiarUsuarioService: CambiarUsuarioService) {
    this.apiService = apiService;
  }

  limpiarListas() {
    this.menuPrincipal = [];
    this.menuAsistencia = [];
    this.menuBiblioteca = [];
    this.menuCantina = [];
    this.menuSeguridad = [];
    this.menuConfiguracion = [];
    this.listaItems = [];
  }

  ngOnInit() {
    this.usuarioSub = this.cambiarUsuarioService.usuario$.subscribe(tipoUsuario => {
      if (tipoUsuario) {
        this.limpiarListas();
        this.cargarListaXTipoUsuario(tipoUsuario);
        this.verMenu = true;
      } else {
        this.verMenu = false;
      }
    });

    this.imagenSub = this.cambiarUsuarioService.imagen$.subscribe(imagen => {
      if (imagen) {
        this.imagen = imagen;
        this.verImagen = true;
      } else {
        this.verImagen = false;
      }
    });

    const tipoUsuarioId = localStorage.getItem('tipoUsuarioId');
    if (tipoUsuarioId) {
      this.limpiarListas();
      this.cargarListaXTipoUsuario(tipoUsuarioId);
      this.verMenu = true;
    } else {
      this.verMenu = false;
    }
  }

  cargarListaXTipoUsuario(tipoUsuarioId: string) {
    this.permisoUsaurioService.getPaginaItemsByTipoUsuarioId(tipoUsuarioId).subscribe({
      next: (res) => {
        this.listaItems = res.message;
        this.verificarPermisoSeguridad();
        this.clasificarItems();
        this.menuActual = this.menuPrincipal;
      },
      error: console.log,
    });
  }

  clickValue(value: PaginaItem) {
    if (value.esCarpeta) {
      this.carpetaActual = value.carpeta;
      if (value.tituloMenu === 'Inicio') {
        this.router.navigate([value.routerLink]);
      }
      this.actualizarCarpeta();
    } else {
      this.router.navigate([value.routerLink]);
    }
  }

  actualizarCarpeta() {
    switch (this.carpetaActual) {
      case 'Principal':
        this.menuActual = this.menuPrincipal;
        break;
      case 'Seguridad':
        this.menuActual = this.menuSeguridad;
        break;
      case 'Configuracion':
        this.menuActual = this.menuConfiguracion;
        break;
      case 'Asistencia':
        this.menuActual = this.menuAsistencia;
        break;
      case 'Biblioteca':
        this.menuActual = this.menuBiblioteca;
        break;
      case 'Cantina':
        this.menuActual = this.menuCantina;
        break;
    }
  }

  agregarInicioSiNoVacio(lista: PaginaItem[], paginaItem: PaginaItem) {
    if (lista.length > 0) {
      lista.unshift(paginaItem);
    }
  }

  clasificarItems() {
    const paginaInicio = this.listaItems.find(item => item.id === 1);
    // Divide los elementos por carpeta
    this.listaItems.forEach(item => {
      switch (item.paginaOrigen) {
        case 'menuPrincipal':
          this.menuPrincipal.push(item);
          break;
        case 'menuAsistencia':
          this.menuAsistencia.push(item);
          break;
        case 'menuBiblioteca':
          this.menuBiblioteca.push(item);
          break;
        case 'menuCantina':
          this.menuCantina.push(item);
          break;
        case 'menuSeguridad':
          this.menuSeguridad.push(item);
          this.tienePermisoSeguridad = true;
          break;
        case 'menuConfiguracion':
          this.menuConfiguracion.push(item);
          break;
      }
    });
    // Agregar el item "Inicio" si la lista tiene al menos un elemento
    this.agregarInicioSiNoVacio(this.menuPrincipal, paginaInicio);
    this.agregarInicioSiNoVacio(this.menuAsistencia, paginaInicio);
    this.agregarInicioSiNoVacio(this.menuBiblioteca, paginaInicio);
    this.agregarInicioSiNoVacio(this.menuCantina, paginaInicio);
    this.agregarInicioSiNoVacio(this.menuSeguridad, paginaInicio);
    this.agregarInicioSiNoVacio(this.menuConfiguracion, paginaInicio);
  }

  verificarPermisoSeguridad() {
    this.tienePermisoSeguridad = this.listaItems.some(item => item.carpeta === 'Seguridad');
  }
}
