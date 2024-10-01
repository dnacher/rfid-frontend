import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {TipoUsuario} from '../../model/TipoUsuario';
import {TipoUsuarioService} from '../../service/seguridad/tipoUsuario.service';
import {PermisoUsuario} from '../../model/PermisoUsuario';
import {PermisoUsuarioService} from '../../service/seguridad/permisoUsuario.service';
import {PaginaItem} from '../../model/PaginaItem';
import {PaginaItemsService} from '../../service/seguridad/paginaItems.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-permiso',
  templateUrl: './permiso.component.html',
  styleUrls: ['./permiso.component.scss'],
})
export class PermisoComponent implements OnInit {

  titulo = 'Permisos';
  opcion: string | null = 'Asistencia';
  displayTable = 'Asistencia';
  tipoUsuarioSelected: TipoUsuario;
  tipoUsuarios: TipoUsuario[];
  permisoUsuarios: PermisoUsuario[] = [];
  seleccionPermisos: { [paginaItemId: number]: string } = {};
  paginaItemsPorCarpeta: { [carpeta: string]: PaginaItem[] } = {}; // Almacena todos los PaginaItem de todas las carpetas, no solo la actual
  opciones: string[] = ['Admin', 'Ver', 'Sin Permiso'];
  nombreBoton = 'Guardar';
  nombreBoton2 = 'Guardar Todo';
  asistenciaItems: PaginaItem[] = [];
  listaPermisos: PermisoUsuario[] = [];
  paginaItemsData;

  constructor(private dialog: MatDialog,
              private tipoUsuarioService: TipoUsuarioService,
              private permisoUsuarioService: PermisoUsuarioService,
              private paginaItemService: PaginaItemsService) {
  }

  ngOnInit() {
    this.getTipoUsuarios();
    this.cargarPermisos();
    this.getPaginaItemsData();
  }

  cargarPermisos() {
    const tipoUsuarioId = localStorage.getItem('tipoUsuarioId');
    this.permisoUsuarioService.getPermisoUsuariosByTipoUsuarioId(tipoUsuarioId).subscribe({
      next: (res) => {
        this.listaPermisos = res.message;
        this.filtrarPermisos();
      },
      error: (err) => console.error('Error cargando permisos:', err),
    });
  }

  filtrarPermisos() {
    this.paginaItemsPorCarpeta[this.opcion] = this.listaPermisos
      .filter(
        (permisoUsuario) =>
          permisoUsuario.permiso === 13 &&
          permisoUsuario.paginaItem.carpeta === this.opcion &&
          permisoUsuario.paginaItem.routerLink !== null
      )
      .map(permisoUsuario => permisoUsuario.paginaItem);
  }

  cargarSeleccionesAnteriores() {
    this.listaPermisos.forEach((permisoUsuario) => {
      this.seleccionPermisos[permisoUsuario.paginaItem.id] = this.getValorPermiso(permisoUsuario.permiso);
    });
  }

  onComboOpcionChange(nuevaOpcion: string) {
    this.opcion = nuevaOpcion;
    this.displayTable = this.opcion;
    this.filtrarPermisos();
  }

  getTipoUsuarios() {
    this.tipoUsuarioService.getTipoUsuarios().subscribe({
      next: (value) => {
        this.tipoUsuarios = value.message;
      },
      error: console.log,
    });
  }

  getPaginaItemsData() {
    this.paginaItemService.getPaginaItems().subscribe({
      next: (value) => {
        this.paginaItemsData = value.message;
      },
      error: console.log,
    });
  }

  getValorPermiso(permiso: number): string {
    switch (permiso) {
      case 13:
        return 'Admin';
      case 10:
        return 'Ver';
      case 1:
        return 'Sin permiso';
      default:
        return 'Sin permiso';
    }
  }

  onSeleccionarPermiso(paginaItemId: number, valorSeleccionado: string) {
    this.seleccionPermisos[paginaItemId] = valorSeleccionado;
  }

  convertirPermiso(valor: string): number {
    switch (valor) {
      case 'Admin':
        return 13;
      case 'Ver':
        return 10;
      case 'Sin permiso':
        return 0;
      default:
        return 0;
    }
  }

  guardar() {
    const permisosActualizados = Object.values(this.paginaItemsPorCarpeta)
      .flat()
      .filter(item => this.seleccionPermisos[item.id]) // Filtra solo los que tienen un permiso seleccionado
      .map(item => ({
        paginaItemId: item.id,
        permiso: this.convertirPermiso(this.seleccionPermisos[item.id])
      }));

    const permisoUsuariosList: PermisoUsuario[] = [];
    permisosActualizados.forEach(permiso => {
      const permisoUsuario = new PermisoUsuario();
      permisoUsuario.tipoUsuario = this.tipoUsuarioSelected;
      permisoUsuario.permiso = permiso.permiso;
      permisoUsuario.paginaItem = this.paginaItemsData.find(item => item.id === permiso.paginaItemId);
      permisoUsuariosList.push(permisoUsuario);
    });
    this.permisoUsuarioService.savePermisoUsuarios(permisoUsuariosList).subscribe({
      next: (data) => {
        if(data.error) {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: data.error,
          });
        } else {
          Swal.fire({
            title: 'Guardado!',
            text: 'Se guardaron los permisos',
            icon: 'success'
          });
          this.limpiarListas();
        }
      },
      error: console.log,
    });
  }

  limpiarListas() {
    // Limpiar las selecciones de permisos
    this.seleccionPermisos = {};

    // Vaciar todas las listas de items por carpeta
    this.paginaItemsPorCarpeta = {};

    // Opcional: limpiar el tipo de usuario seleccionado si es necesario
    this.tipoUsuarioSelected = null;

    // Si necesitas limpiar la UI, reiniciar el modelo para los radiobuttons o selects
    this.opcion = '';

    // Otras acciones para actualizar la UI si es necesario
  }

  getPermisoValue(permiso: string): number {
    switch (permiso) {
      case 'Admin':
        return 13;
      case 'Ver':
        return 7;
      case 'Sin Permiso':
        return 0;
    }
  }

  puedeGuardar(): boolean {
    const tieneSeleccionTipoUsuario = !!this.tipoUsuarioSelected; // Verifica si se ha seleccionado un TipoUsuario
    const tieneSeleccionPermisos = Object.values(this.seleccionPermisos).some(seleccion => seleccion !== undefined
      && seleccion !== null && seleccion !== ''); // Verifica si hay alguna selección en los radiobuttons

    return tieneSeleccionTipoUsuario && tieneSeleccionPermisos;
  }

}
